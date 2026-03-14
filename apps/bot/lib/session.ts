/**
 * Unified Session API
 *
 * Creates agent sessions that can be used from any interface (Slack, Chat API, etc.)
 * Encapsulates: agent config, sandbox, tools, skills, and generation.
 */

import { ToolLoopAgent, stepCountIs } from 'ai'
import {
  createSkillTool,
  loadSkills,
  buildInlineSkillContext,
} from '@syner/vercel'
import { getAgentByName, getModel, type AgentCard } from '@syner/sdk/agents'
import { createToolSession, type ToolSession } from './tools'
import {
  createContext,
  createAction,
  verify,
  createResult,
  type Result,
  type ContextSource,
} from '@syner/osprotocol'
import { resolveContext, type ContextRequest } from '@syner/sdk/context'
import type { VaultStore } from '@syner/sdk/context'
import path from 'path'

export interface Session {
  /** Agent configuration */
  agent: AgentCard
  /** Working directory in sandbox (if tools enabled) */
  workdir: string
  /** Generate a response for the given prompt */
  generate(prompt: string): Promise<Result<GenerateResult>>
  /** Cleanup sandbox and resources */
  cleanup(): Promise<void>
}

export interface GenerateResult {
  text: string
  steps: number
  toolCalls: string[]
}

export interface SessionOptions {
  /** Agent name (default: 'syner') - ignored if agent config provided */
  agentName?: string
  /** Full agent config (use this to avoid fs lookups in serverless) */
  agent?: AgentCard
  /** Vault store for context resolution */
  vaultStore?: VaultStore
  /** Context request (scope, app, query) for vault loading */
  contextRequest?: ContextRequest
  /** Callback when status changes (e.g., 'Cloning repository...') */
  onStatus?: (status: string) => void | Promise<void>
  /** Callback when tool starts */
  onToolStart?: (toolName: string) => void
  /** Callback when tool finishes */
  onToolFinish?: (toolName: string, durationMs: number, success: boolean) => void
  /** Callback when step finishes */
  onStepFinish?: (stepNumber: number, toolNames: string[]) => void
  /** Callback when generation produces a result (success or error) */
  onResult?: (result: Result<GenerateResult>) => Promise<void> | void
}

const DEFAULT_AGENT = 'syner'

// Project root is two levels up from apps/bot
function getProjectRoot(): string {
  return path.resolve(process.cwd(), '../..')
}

/**
 * Create a session for an agent
 *
 * @example
 * ```ts
 * const session = await createSession({ agent: 'syner' })
 * const result = await session.generate('What can you do?')
 * await session.cleanup()
 * ```
 */
export async function createSession(options?: SessionOptions): Promise<Session> {
  const onStatus = options?.onStatus || (() => {})

  // 1. Get agent config (prefer provided config over fs lookup)
  let agent: AgentCard
  if (options?.agent) {
    agent = options.agent
  } else {
    const agentName = options?.agentName || DEFAULT_AGENT
    const projectRoot = getProjectRoot()
    const foundAgent = await getAgentByName(projectRoot, agentName)
    if (!foundAgent) {
      throw new Error(`Agent "${agentName}" not found`)
    }
    agent = foundAgent
  }

  // 2. Create tool session (sandbox) if agent has tools
  let toolSession: ToolSession | undefined
  let workdir = '.'

  if (agent.tools && agent.tools.length > 0) {
    await onStatus('Cloning repository...')
    // Generate ephemeral GitHub token before sandbox creation
    const sandboxEnv: Record<string, string> = {}
    try {
      const { getToken } = await import('@syner/github')
      const token = await getToken()
      sandboxEnv.GITHUB_TOKEN = token
    } catch {
      // GitHub auth not available — agent will work without it
    }

    toolSession = await createToolSession(agent.tools, { env: sandboxEnv })
    workdir = toolSession.workdir
  }

  // 3. Load skills if agent has them
  let skillContext = ''
  let agentTools = toolSession?.tools || {}

  if (agent.skills && agent.skills.length > 0 && toolSession) {
    const skills = await loadSkills(workdir, agent.skills)

    // Add skill descriptions to system prompt (inline mode)
    skillContext = buildInlineSkillContext(skills)

    // Add Skill tool for fork mode (invoke skills as subagents)
    const skillTool = createSkillTool({
      repoRoot: workdir,
      availableSkills: agent.skills,
      tools: toolSession.tools,
      model: getModel(agent),
    })

    agentTools = {
      ...agentTools,
      skill: skillTool,
    }
  }

  // 4. Create the ToolLoopAgent
  const loopAgent = new ToolLoopAgent({
    id: agent.name,
    model: getModel(agent),
    instructions: `${agent.instructions}\n\n${skillContext}\n\n## Working Directory\n\nThe repository is available at: ${workdir}`,
    tools: agentTools,
    stopWhen: stepCountIs(10),
  })

  // 5. Return session interface
  return {
    agent,
    workdir,

    async generate(prompt: string): Promise<Result<GenerateResult>> {
      await onStatus('Thinking...')
      const startTime = Date.now()

      // Resolve vault context if store is provided
      const loadedSources: ContextSource[] = toolSession
        ? [{ type: 'skill' as const, ref: 'tools', summary: 'sandbox tools' }]
        : []
      const missingTopics: string[] = []

      if (options?.vaultStore) {
        const request = options.contextRequest ?? { scope: 'none' as const }
        const brief = await resolveContext(request, options.vaultStore)
        for (const source of brief.sources) {
          loadedSources.push({ type: 'vault' as const, ref: source })
        }
        missingTopics.push(...brief.gaps)
      }

      const context = createContext({
        agentId: agent.name,
        skillRef: `session:${agent.name}`,
        loaded: loadedSources,
        missing: missingTopics,
      })

      const action = createAction({
        description: `Generate response for: ${prompt.slice(0, 100)}`,
        expectedEffects: [{ description: 'Response generated', verifiable: true }],
      })

      const toolCallsList: string[] = []

      try {
        const result = await loopAgent.generate({
          prompt,

          experimental_onToolCallStart({ toolCall }) {
            options?.onToolStart?.(toolCall.toolName)
          },

          experimental_onToolCallFinish({ toolCall, durationMs, success }) {
            toolCallsList.push(toolCall.toolName)
            options?.onToolFinish?.(toolCall.toolName, durationMs, success)
          },

          onStepFinish({ stepNumber, toolCalls }) {
            const toolNames = toolCalls?.map(tc => tc.toolName) || []
            options?.onStepFinish?.(stepNumber, toolNames)
          },
        })

        const output: GenerateResult = {
          text: result.text || '',
          steps: result.steps.length,
          toolCalls: toolCallsList,
        }

        const hasText = output.text.length > 0
        const verification = verify(
          action.expectedEffects,
          { 'Response generated': hasText }
        )

        const ospResult = {
          ...createResult(context, action, verification, output),
          duration: Date.now() - startTime,
        }
        await options?.onResult?.(ospResult)
        return ospResult
      } catch (error) {
        console.error('[Session] generate() error:', error)
        const verification = verify(
          action.expectedEffects,
          { 'Response generated': false }
        )

        const ospResult: Result<GenerateResult> = {
          ...createResult(context, action, verification),
          output: undefined,
          duration: Date.now() - startTime,
        }
        await options?.onResult?.(ospResult)
        return ospResult
      }
    },

    async cleanup(): Promise<void> {
      if (toolSession) {
        await toolSession.cleanup()
      }
    },
  }
}
