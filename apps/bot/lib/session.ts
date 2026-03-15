/**
 * Unified Session API
 *
 * Creates agent sessions that can be used from any interface (Slack, Chat API, etc.)
 * Encapsulates: agent config, sandbox, tools, skills, and generation.
 *
 * Uses lazy sandbox initialization: tools are defined immediately (so the LLM
 * sees them), but the sandbox is only created when a tool is first executed.
 * If the LLM can answer without tools, no sandbox is ever created.
 */

import { ToolLoopAgent, stepCountIs, type ToolSet } from 'ai'
import {
  createSkillTool,
  loadSkills,
  buildInlineSkillContext,
} from '@syner/vercel'
import { getAgentByName, resolveModel, type AgentCard } from '@syner/sdk/agents'
import { createLazyToolSession, type ToolSession } from './tools'
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
 * Tools are provided to the LLM immediately (lazy initialization), but the
 * sandbox is only created if/when the LLM actually calls a tool. This means
 * conversational messages get fast responses with no sandbox overhead.
 */
export async function createSession(options?: SessionOptions): Promise<Session> {
  const onStatus = options?.onStatus || (() => {})

  // 1. Get agent config
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

  // 2. Create lazy tool session (no sandbox yet — created on first tool call)
  let toolSession: ToolSession | undefined
  if (agent.tools && agent.tools.length > 0) {
    toolSession = createLazyToolSession(agent.tools, undefined, onStatus)
  }

  // 3. Resolve model tier and fallback chain
  const tier = agent.model ?? 'sonnet'
  const { model, fallbacks, modelId } = resolveModel(tier)

  // 4. Create the ToolLoopAgent
  const loopAgent = new ToolLoopAgent({
    id: agent.name,
    model,
    instructions: agent.instructions,
    tools: toolSession?.tools ?? ({} as ToolSet),
    stopWhen: stepCountIs(10),
    providerOptions: {
      gateway: { models: fallbacks },
    },
  })

  // 5. Return session interface
  return {
    agent,
    get workdir() { return toolSession?.workdir || '.' },

    async generate(prompt: string): Promise<Result<GenerateResult>> {
      await onStatus('Thinking...')
      const startTime = Date.now()

      const loadedSources: ContextSource[] = []
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

        const usedTools = toolCallsList.length > 0
        console.log(`[Session][${agent.name}] model=${modelId} tier=${tier} path=${usedTools ? 'tools' : 'direct'} steps=${result.steps.length} tools=[${toolCallsList}]`)

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
        console.error(`[Session][${agent.name}] model=${modelId} tier=${tier} ERROR:`, error instanceof Error ? error.message : error)
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
