/**
 * Unified Session API
 *
 * Creates agent sessions that can be used from any interface (Slack, Chat API, etc.)
 * Encapsulates: agent config, sandbox, tools, skills, and generation.
 *
 * Skill injection: hybrid pattern (prepareStep + preprocessing)
 * - Skill tool has NO execute — calling it pauses the loop
 * - prepareStep injects skill content as user message (high attention priority)
 * - Explicit /skillname in prompt preprocessed before the loop starts
 */

import { ToolLoopAgent, stepCountIs, type ToolSet } from 'ai'
import { SkillLoader } from '@syner/vercel'
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
  agent: AgentCard
  workdir: string
  generate(prompt: string): Promise<Result<GenerateResult>>
  cleanup(): Promise<void>
}

export interface GenerateResult {
  text: string
  steps: number
  toolCalls: string[]
}

export interface SessionOptions {
  agentName?: string
  agent?: AgentCard
  vaultStore?: VaultStore
  contextRequest?: ContextRequest
  onStatus?: (status: string) => void | Promise<void>
  onToolStart?: (toolName: string) => void
  onToolFinish?: (toolName: string, durationMs: number, success: boolean) => void
  onStepFinish?: (stepNumber: number, toolNames: string[]) => void
  onResult?: (result: Result<GenerateResult>) => Promise<void> | void
}

const DEFAULT_AGENT = 'syner'

function getProjectRoot(): string {
  return path.resolve(process.cwd(), '../..')
}

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

  // 2. Create lazy tool session (sandbox tools)
  let toolSession: ToolSession | undefined
  if (agent.tools && agent.tools.length > 0) {
    toolSession = createLazyToolSession(agent.tools, undefined, onStatus)
  }

  // 3. Set up SkillLoader
  const projectRoot = getProjectRoot()
  const skillLoader = new SkillLoader({
    indexPath: path.join(projectRoot, 'public/.well-known/skills/index.json'),
    skillDirs: [
      path.join(projectRoot, 'skills'),
      path.join(projectRoot, 'apps/bot/skills'),
      path.join(projectRoot, 'apps/dev/skills'),
      path.join(projectRoot, 'apps/vaults/skills'),
    ],
  })

  // 4. Build tools: sandbox tools + Skill tool (no execute)
  const tools: Record<string, unknown> = {
    ...(toolSession?.tools ?? {}),
  }
  if (skillLoader.names.length > 0) {
    tools.Skill = skillLoader.createTool()
  }

  // 5. Build instructions: agent instructions + skill descriptions
  const skillDescriptions = skillLoader.describeSkills()
  const instructions = skillDescriptions
    ? `${agent.instructions}\n\n${skillDescriptions}`
    : agent.instructions

  // 6. Resolve model
  const tier = agent.model ?? 'sonnet'
  const { model, fallbacks, modelId } = resolveModel(tier)

  // 7. Create ToolLoopAgent with prepareStep for skill injection
  const loopAgent = new ToolLoopAgent({
    id: agent.name,
    model,
    instructions,
    tools: tools as ToolSet,
    stopWhen: stepCountIs(10),
    prepareStep: skillLoader.createPrepareStep(),
    providerOptions: {
      gateway: { models: fallbacks },
    },
  })

  return {
    agent,
    get workdir() { return toolSession?.workdir || '.' },

    async generate(prompt: string): Promise<Result<GenerateResult>> {
      await onStatus('Thinking...')
      const startTime = Date.now()

      // Preprocess: detect /skillname and inject content into prompt
      const processedPrompt = skillLoader.preprocessPrompt(prompt)

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
          prompt: processedPrompt,

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

        const verification = verify(
          action.expectedEffects,
          { 'Response generated': output.text.length > 0 }
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
