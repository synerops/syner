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

    // Cached per-agent: model, instructions, static tools (Fetch, Skill, Task),
    // and the list of sandbox tool names. Sandbox-dependent tools are built per
    // request since they close over a fresh sandbox instance.
    const tier_ = agentCard.model ?? 'sonnet'
    const { model: model_, fallbacks: fallbacks_, modelId: modelId_ } = resolveModel(tier_)

    const skillDescriptions_ = skills_.describe()
    const instructions_ = skillDescriptions_
      ? `${agentCard.instructions}\n\n${skillDescriptions_}`
      : agentCard.instructions

    // Static tools — no per-request state
    const staticTools_: Record<string, Tool> = {}
    if (agentCard.tools?.includes('Fetch')) {
      staticTools_.Fetch = tool({
        description: 'Fetch URL content as markdown (truncated to 50k chars)',
        inputSchema: fetchInputSchema,
        execute: (input) => executeFetch(input as FetchInput),
      })
    }
    if (skills_.size > 0) {
      staticTools_.Skill = createSkillTool(skills_)
    }
    staticTools_.Task = createTaskTool({ runAdapter })

    // Which sandbox tools this agent needs
    const sandboxToolNames_ = (agentCard.tools || []).filter(
      n => ['Bash', 'Read', 'Write', 'Glob', 'Grep'].includes(n)
    )

    function prepareExecution() {
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

      // Sandbox tools — fresh per request
      const sandboxTools: Record<string, Tool> = {}
      for (const name of sandboxToolNames_) {
        if (name === 'Bash') {
          sandboxTools.Bash = tool({
            description: 'Execute a command in the sandbox shell',
            inputSchema: bashInputSchema,
            execute: async (input) => {
              const sb = await ensureSandbox()
              return executeBash(sb, input as BashInput)
            },
          })
        } else if (name === 'Read') {
          sandboxTools.Read = tool({
            description: 'Read a file from the sandbox filesystem',
            inputSchema: readInputSchema,
            execute: async (input) => {
              const sb = await ensureSandbox()
              return executeRead(sb, input as ReadInput)
            },
          })
        } else if (name === 'Write') {
          sandboxTools.Write = tool({
            description: 'Write content to a file (creates parent directories if needed)',
            inputSchema: writeInputSchema,
            execute: async (input) => {
              const sb = await ensureSandbox()
              return executeWrite(sb, input as WriteInput)
            },
          })
        } else if (name === 'Glob') {
          sandboxTools.Glob = tool({
            description: 'Find files matching a glob pattern',
            inputSchema: globInputSchema,
            execute: async (input) => {
              const sb = await ensureSandbox()
              return executeGlob(sb, input as GlobInput)
            },
          })
        } else if (name === 'Grep') {
          sandboxTools.Grep = tool({
            description: 'Search file contents with regex',
            inputSchema: grepInputSchema,
            execute: async (input) => {
              const sb = await ensureSandbox()
              return executeGrep(sb, input as GrepInput)
            },
          })
        }
      }

      const loopAgent = new ToolLoopAgent({
        id: agentCard.name,
        model: model_,
        instructions: instructions_,
        tools: { ...staticTools_, ...sandboxTools } as ToolSet,
        stopWhen: stepCountIs(20),
        prepareStep: createPrepareStep(skills_, getBaseUrl),
        providerOptions: {
          gateway: { models: fallbacks_ },
        },
      })

      return {
        loopAgent,
        tier: tier_,
        modelId: modelId_,
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

      const { loopAgent, tier, modelId, cleanupSandbox } = prepareExecution()

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
      const { loopAgent, tier, modelId, cleanupSandbox } = prepareExecution()

      // Safety net: cleanup sandbox after 5 minutes even if stream is abandoned
      const cleanupTimeout = setTimeout(async () => {
        console.warn(`[Runtime][${agentCard.name}] stream timeout — forcing sandbox cleanup`)
        await cleanupSandbox()
      }, 300_000)

      const result = await loopAgent.stream({
        prompt,

        experimental_onToolCallStart({ toolCall }) {
          options?.onToolStart?.(toolCall.toolName)
        },

        experimental_onToolCallFinish({ toolCall, durationMs, success }) {
          options?.onToolFinish?.(toolCall.toolName, durationMs, success)
        },

        async onFinish({ steps, text }) {
          clearTimeout(cleanupTimeout)
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
