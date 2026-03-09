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
import { getAgentByName, type AgentConfig } from './agents'
import { getModel } from './agents/models'
import { createToolSession, type ToolSession } from './tools'

export interface Session {
  /** Agent configuration */
  agent: AgentConfig
  /** Working directory in sandbox (if tools enabled) */
  workdir: string
  /** Generate a response for the given prompt */
  generate(prompt: string): Promise<GenerateResult>
  /** Cleanup sandbox and resources */
  cleanup(): Promise<void>
}

export interface GenerateResult {
  text: string
  steps: number
  toolCalls: string[]
}

export interface SessionOptions {
  /** Agent name (default: 'syner') */
  agent?: string
  /** Callback when status changes (e.g., 'Cloning repository...') */
  onStatus?: (status: string) => void | Promise<void>
  /** Callback when tool starts */
  onToolStart?: (toolName: string) => void
  /** Callback when tool finishes */
  onToolFinish?: (toolName: string, durationMs: number, success: boolean) => void
  /** Callback when step finishes */
  onStepFinish?: (stepNumber: number, toolNames: string[]) => void
}

const DEFAULT_AGENT = 'syner'

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
  const agentName = options?.agent || DEFAULT_AGENT
  const onStatus = options?.onStatus || (() => {})

  // 1. Load agent config
  const agent = await getAgentByName(agentName)
  if (!agent) {
    throw new Error(`Agent "${agentName}" not found`)
  }

  // 2. Create tool session (sandbox) if agent has tools
  let toolSession: ToolSession | undefined
  let workdir = '.'

  if (agent.tools && agent.tools.length > 0) {
    await onStatus('Cloning repository...')
    toolSession = await createToolSession(agent.tools)
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

    async generate(prompt: string): Promise<GenerateResult> {
      await onStatus('Thinking...')

      const toolCallsList: string[] = []

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

      return {
        text: result.text || '',
        steps: result.steps.length,
        toolCalls: toolCallsList,
      }
    },

    async cleanup(): Promise<void> {
      if (toolSession) {
        await toolSession.cleanup()
      }
    },
  }
}
