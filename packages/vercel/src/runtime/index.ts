import { ToolLoopAgent, stepCountIs, type ToolSet } from 'ai'
import {
  getAgentsRegistry,
  getAgentsByChannel,
  resolveModel,
  type AgentCard,
  type Agent,
  type AgentCardOutput,
  type GenerateResult,
  type GenerateOptions,
} from '@syner/sdk/agents'
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
import { SkillsMap } from '../skills'
import { loadSkills } from '../skills/loader'
import { createSkillTool, createPrepareStep } from '../tools/skill'
import { createTaskTool } from '../tools/task'
import { VercelRunAdapter } from './adapter'
import { createSandbox, stopSandbox, type Sandbox } from './sandbox'
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
import path from 'path'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RuntimeConfig {
  agents?: { dir?: string }
  skills?: { index?: string; dir?: string }
}

// Agent, AgentCardOutput, GenerateResult, GenerateOptions — defined in @syner/sdk/agents

export interface Runtime {
  /** Map<name, AgentCard> — lazy-loaded, cached. Call start() to populate. */
  agents: Map<string, AgentCard>
  /** SkillsMap — all discovered skills with domain methods. Live reference, reflects post-start() state. */
  readonly skills: SkillsMap
  /** Load/refresh agents + skills from disk */
  start(): Promise<void>
  /** Get agents indexed by Slack channel */
  byChannel(): Promise<Map<string, AgentCard>>
  /** Get an agent by name */
  agent(name: string): Agent
}

// ---------------------------------------------------------------------------
// createRuntime
// ---------------------------------------------------------------------------

const DEFAULT_REPO_URL = 'https://github.com/synerops/syner.git'
const DEFAULT_BRANCH = 'main'

function getProjectRoot(): string {
  return path.resolve(process.cwd(), '../..')
}

export function createRuntime(config?: RuntimeConfig): Runtime {
  const projectRoot = getProjectRoot()
  const skillsDir = config?.skills?.dir ?? path.join(projectRoot, 'public/.well-known/skills')
  const skillIndex = config?.skills?.index ?? path.join(skillsDir, 'index.json')

  // --- Maps ---
  const agents_ = new Map<string, AgentCard>()
  let skills_ = new SkillsMap()
  const runAdapter = new VercelRunAdapter()

  /** Load/refresh agents + skills from disk into the Maps */
  async function start(): Promise<void> {
    skills_ = await loadSkills(skillIndex)

    const registry = await getAgentsRegistry(projectRoot)
    agents_.clear()
    for (const [name, card] of registry.agents) {
      agents_.set(name, card)
    }
  }

  /** Get agents by Slack channel (delegates to SDK) */
  async function byChannel(): Promise<Map<string, AgentCard>> {
    return getAgentsByChannel(projectRoot)
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
        capabilities: { streaming: false, pushNotifications: false },
        skills: agentSkills.map(s => ({
          id: s.name,
          name: s.name,
          description: s.description,
        })),
      }
    }

    async function generate(
      prompt: string,
      options?: GenerateOptions,
    ): Promise<Result<GenerateResult>> {
      const onStatus = options?.onStatus ?? (() => {})
      await onStatus('Thinking...')
      const startTime = Date.now()

      // 1. Resolve model
      const tier = agentCard.model ?? 'sonnet'
      const { model, fallbacks, modelId } = resolveModel(tier)

      // 2. Lazy sandbox (created on first tool use, shared per generate call)
      //    Uses snapshot caching: first call clones + snapshots, subsequent calls restore instantly.
      let sandbox: Sandbox | null = null
      let initPromise: Promise<Sandbox> | null = null

      async function ensureSandbox(): Promise<Sandbox> {
        if (sandbox) return sandbox
        if (initPromise) return initPromise
        initPromise = (async () => {
          try {
            await onStatus('Preparing sandbox...')
            const result = await createSandbox({
              repoUrl: DEFAULT_REPO_URL,
              branch: DEFAULT_BRANCH,
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

      // 3. Build active tools from agent.tools
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

      // 4. Skill tool (execute: true + prepareStep injection)
      if (skills_.size > 0) {
        activeTools.Skill = createSkillTool(skills_)
      }

      // 5. Task tool (RunAdapter)
      activeTools.Task = createTaskTool({ runAdapter })

      // 6. System prompt (agent.instructions + skill descriptions)
      const skillDescriptions = skills_.describe()
      const instructions = skillDescriptions
        ? `${agentCard.instructions}\n\n${skillDescriptions}`
        : agentCard.instructions

      // 7. Vault context (optional)
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

      // 8. OSProtocol wrapping
      const context = createContext({
        agentId: agentCard.name,
        skillRef: `runtime:${agentCard.name}`,
        loaded: loadedSources,
        missing: missingTopics,
      })

      const action = createAction({
        description: `Generate response for: ${prompt.slice(0, 100)}`,
        expectedEffects: [{ description: 'Response generated', verifiable: true }],
      })

      const toolCallsList: string[] = []

      // 9. Execute via ToolLoopAgent
      const loopAgent = new ToolLoopAgent({
        id: agentCard.name,
        model,
        instructions,
        tools: activeTools as ToolSet,
        stopWhen: stepCountIs(10),
        prepareStep: createPrepareStep(skills_, skillsDir) as never,
        providerOptions: {
          gateway: { models: fallbacks },
        },
      })

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
        console.error(`[Runtime][${agentCard.name}] model=${modelId} tier=${tier} ERROR:`, error instanceof Error ? error.message : error)
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
        if (sandbox) {
          await stopSandbox(sandbox)
        }
      }
    }

    return {
      name: agentCard.name,
      description: agentCard.description || '',
      card,
      generate,
    }
  }

  /** Get an agent by name */
  function agent(name: string): Agent {
    const card = agents_.get(name)
    if (!card) throw new Error(`Agent not found: ${name}`)
    return createAgent(card)
  }

  return {
    agents: agents_,
    get skills() { return skills_ },
    start,
    byChannel,
    agent,
  }
}
