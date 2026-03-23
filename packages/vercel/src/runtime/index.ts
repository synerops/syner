import { ToolLoopAgent, stepCountIs, type ToolSet } from 'ai'
import {
  resolveModel,
  type AgentCard,
  type Agent,
  type AgentCardOutput,
  type AgentStream,
  type GenerateResult,
  type GenerateOptions,
  type StreamOptions,
} from 'syner/agents'
import type { Skill } from 'syner/skills'
import {
  createContext,
  createAction,
  verify,
  createResult,
  type Result,
} from 'syner/protocol'
import { SkillsMap } from 'syner/skills'
import { createSkillTool, createPrepareStep } from '../tools/skill'
import { createTaskTool } from '../tools/task'
import { VercelRunAdapter } from './adapter'
import { createSandbox, stopSandbox, type Sandbox } from './sandbox'
import { createSystem } from './system'
import {
  bashInputSchema,
  type BashInput,
  executeBash,
  fetchInputSchema,
  type FetchInput,
  executeFetch,
  readInputSchema,
  type ReadInput,
  executeRead,
  writeInputSchema,
  type WriteInput,
  executeWrite,
  globInputSchema,
  type GlobInput,
  executeGlob,
  grepInputSchema,
  type GrepInput,
  executeGrep,
} from '../tools'
import { tool, type Tool } from 'ai'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

// Agent, AgentCardOutput, GenerateResult, GenerateOptions — defined in @syner/sdk/agents

export interface Runtime {
  /** Agents map — call start() to populate. */
  agents: Map<string, AgentCard>
  /** SkillsMap — all discovered skills with domain methods. Live reference, reflects post-start() state. */
  readonly skills: SkillsMap
  /** Load/refresh agents + skills */
  start(): Promise<void>
  /** Get an agent by name */
  agent(name: string): Agent
}

// ---------------------------------------------------------------------------
// createRuntime
// ---------------------------------------------------------------------------

/**
 * Sandbox configuration via environment variables:
 *   SANDBOX_REPO   — Git repo URL for sandbox cloning (default: synerops/syner)
 *   SANDBOX_BRANCH — Branch to clone in the sandbox (default: main)
 */
const SANDBOX_REPO = process.env.SANDBOX_REPO || 'https://github.com/synerops/syner.git'
const SANDBOX_BRANCH = process.env.SANDBOX_BRANCH || 'main'

export function createRuntime(): Runtime {
  // --- Maps ---
  let agents_ = new Map<string, AgentCard>()
  let skills_ = new SkillsMap()
  const runAdapter = new VercelRunAdapter()
  const _system = createSystem()

  /** Resolve the base URL for fetching static routes */
  function getBaseUrl(): string {
    if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
      return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    }
    return `http://localhost:${process.env.PORT || 3001}`
  }

  /** Load agents + skills from pre-computed static routes */
  async function start(): Promise<void> {
    const baseUrl = getBaseUrl()
    const headers: Record<string, string> = {}
    const bypass = process.env.VERCEL_AUTOMATION_BYPASS_SECRET
    if (bypass) headers['x-vercel-protection-bypass'] = bypass

    const [agentsData, skillsData] = await Promise.all([
      fetch(`${baseUrl}/api/agents`, { headers }).then(r => r.json()),
      fetch(`${baseUrl}/api/skills`, { headers }).then(r => r.json()),
    ])

    agents_ = new Map((agentsData as AgentCard[]).map(a => [a.name, a]))
    skills_ = new SkillsMap((skillsData as Skill[]).map(s => [s.name, s]))
  }

  /** Create an Agent that owns its card and generate lifecycle */
  function createAgent(agentCard: AgentCard): Agent {
    function card(): AgentCardOutput {
      // Filter skills by agent's skill list, or show all if not defined
      const agentSkills = agentCard.skills
        ? [...skills_.values()].filter(s => agentCard.skills!.includes(s.name))
        : [...skills_.values()]

      return {
        name: agentCard.name,
        description: agentCard.description || '',
        url: process.env.VERCEL_PROJECT_PRODUCTION_URL
          ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
          : 'http://localhost:3001',
        version: '0.1.0',
        capabilities: { streaming: true, pushNotifications: false },
        skills: agentSkills.map(s => ({
          id: s.name,
          name: s.name,
          description: s.description,
        })),
      }
    }

    function prepareExecution(prompt: string) {
      const tier = agentCard.model ?? 'sonnet'
      const { model, fallbacks, modelId } = resolveModel(tier)

      let sandbox: Sandbox | null = null
      let initPromise: Promise<Sandbox> | null = null

      async function ensureSandbox(): Promise<Sandbox> {
        if (sandbox) return sandbox
        if (initPromise) return initPromise
        initPromise = (async () => {
          try {
            const result = await createSandbox({
              repoUrl: SANDBOX_REPO,
              branch: SANDBOX_BRANCH,
              timeout: 300000,
            })
            sandbox = result.sandbox
            return sandbox
          } finally {
            initPromise = null
          }
        })()
        return initPromise
      }

      const activeTools: Record<string, Tool> = {}

      if (agentCard.tools && agentCard.tools.length > 0) {
        for (const name of agentCard.tools) {
          if (['Skill', 'Task'].includes(name)) continue

          if (name === 'Bash') {
            activeTools.Bash = tool({
              description: 'Execute a command in the sandbox shell',
              inputSchema: bashInputSchema,
              execute: async (input) => {
                const sb = await ensureSandbox()
                return executeBash(sb, input as BashInput)
              },
            })
          } else if (name === 'Fetch') {
            activeTools.Fetch = tool({
              description: 'Fetch URL content as markdown (truncated to 50k chars)',
              inputSchema: fetchInputSchema,
              execute: (input) => executeFetch(input as FetchInput),
            })
          } else if (name === 'Read') {
            activeTools.Read = tool({
              description: 'Read a file from the sandbox filesystem',
              inputSchema: readInputSchema,
              execute: async (input) => {
                const sb = await ensureSandbox()
                return executeRead(sb, input as ReadInput)
              },
            })
          } else if (name === 'Write') {
            activeTools.Write = tool({
              description: 'Write content to a file (creates parent directories if needed)',
              inputSchema: writeInputSchema,
              execute: async (input) => {
                const sb = await ensureSandbox()
                return executeWrite(sb, input as WriteInput)
              },
            })
          } else if (name === 'Glob') {
            activeTools.Glob = tool({
              description: 'Find files matching a glob pattern',
              inputSchema: globInputSchema,
              execute: async (input) => {
                const sb = await ensureSandbox()
                return executeGlob(sb, input as GlobInput)
              },
            })
          } else if (name === 'Grep') {
            activeTools.Grep = tool({
              description: 'Search file contents with regex',
              inputSchema: grepInputSchema,
              execute: async (input) => {
                const sb = await ensureSandbox()
                return executeGrep(sb, input as GrepInput)
              },
            })
          }
        }
      }

      if (skills_.size > 0) {
        activeTools.Skill = createSkillTool(skills_)
      }
      activeTools.Task = createTaskTool({ runAdapter })

      const skillDescriptions = skills_.describe()
      const instructions = skillDescriptions
        ? `${agentCard.instructions}\n\n${skillDescriptions}`
        : agentCard.instructions

      const loopAgent = new ToolLoopAgent({
        id: agentCard.name,
        model,
        instructions,
        tools: activeTools as ToolSet,
        stopWhen: stepCountIs(10),
        prepareStep: createPrepareStep(skills_, getBaseUrl) as never,
        providerOptions: {
          gateway: { models: fallbacks },
        },
      })

      return {
        loopAgent,
        tier,
        modelId,
        cleanupSandbox: async () => { if (sandbox) await stopSandbox(sandbox) },
      }
    }

    async function spawn(
      prompt: string,
      options?: GenerateOptions,
    ): Promise<Result<GenerateResult>> {
      const onStatus = options?.onStatus ?? (() => {})
      await onStatus('Thinking...')
      const startTime = Date.now()

      const { loopAgent, tier, modelId, cleanupSandbox } = prepareExecution(prompt)

      const context = createContext({
        agentId: agentCard.name,
        skillRef: `runtime:${agentCard.name}`,
        loaded: [],
        missing: [],
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
            const toolNames = toolCalls?.map((tc: { toolName: string }) => tc.toolName) || []
            options?.onStepFinish?.(stepNumber, toolNames)
          },
        })

        const usedTools = toolCallsList.length > 0
        console.log(`[Runtime][${agentCard.name}] model=${modelId} tier=${tier} path=${usedTools ? 'tools' : 'direct'} steps=${result.steps.length} tools=[${toolCallsList}]`)

        const output: GenerateResult = {
          text: result.text || '',
          steps: result.steps.length,
          toolCalls: toolCallsList,
        }

        const verification = verify(
          action.expectedEffects,
          { 'Response generated': output.text.length > 0 },
        )

        const ospResult = {
          ...createResult(context, action, verification, output),
          duration: Date.now() - startTime,
        }
        await options?.onResult?.(ospResult)
        return ospResult
      } catch (error) {
        console.error(`[Runtime][${agentCard.name}] model=${modelId} tier=${tier} ERROR:`, error instanceof Error ? error.stack : error)
        const verification = verify(
          action.expectedEffects,
          { 'Response generated': false },
        )

        const ospResult: Result<GenerateResult> = {
          ...createResult(context, action, verification),
          output: undefined,
          duration: Date.now() - startTime,
        }
        await options?.onResult?.(ospResult)
        return ospResult
      } finally {
        await cleanupSandbox()
      }
    }

    async function stream(
      prompt: string,
      options?: StreamOptions,
    ): Promise<AgentStream> {
      const { loopAgent, tier, modelId, cleanupSandbox } = prepareExecution(prompt)

      const result = await loopAgent.stream({
        prompt,

        experimental_onToolCallStart({ toolCall }) {
          options?.onToolStart?.(toolCall.toolName)
        },

        experimental_onToolCallFinish({ toolCall, durationMs, success }) {
          options?.onToolFinish?.(toolCall.toolName, durationMs, success)
        },

        async onFinish({ steps, text }) {
          console.log(`[Runtime][${agentCard.name}] stream model=${modelId} tier=${tier} steps=${steps.length} text=${(text || '').length}chars`)
          await cleanupSandbox()
        },
      })

      return {
        fullStream: result.fullStream,
        textStream: result.textStream,
      }
    }

    return {
      name: agentCard.name,
      description: agentCard.description || '',
      card,
      spawn,
      stream,
    }
  }

  /** Get an agent by name */
  function agent(name: string): Agent {
    const card = agents_.get(name)
    if (!card) throw new Error(`Agent not found: ${name}`)
    return createAgent(card)
  }

  return {
    get agents() { return agents_ },
    get skills() { return skills_ },
    start,
    agent,
  }
}
