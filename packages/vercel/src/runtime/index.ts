import { ToolLoopAgent, stepCountIs, type ToolSet } from 'ai'
import {
  getAgentsRegistry,
  getAgentsByChannel,
  resolveModel,
  type AgentCard,
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
import { SkillLoader, SkillsMap, type SkillDescriptor } from '../skills'
import { createSkillTool, createPrepareStep, preprocessPrompt } from '../tools/skill'
import { createTaskTool } from '../tools/task'
import { VercelRunAdapter } from './adapter'
import { createAgentSandbox, stopSandbox, type AgentSandbox } from './sandbox'
import {
  bashInputSchema,
  fetchInputSchema,
  readInputSchema,
  writeInputSchema,
  globInputSchema,
  grepInputSchema,
  executeBashWithSandbox,
  executeFetchWithSandbox,
  executeReadWithSandbox,
  executeWriteWithSandbox,
  executeGlobWithSandbox,
  executeGrepWithSandbox,
} from '../tools'
import { tool, type Tool } from 'ai'
import path from 'path'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RuntimeConfig {
  agents?: { dir?: string }
  skills?: { index?: string; dirs?: string[] }
}

export interface GenerateResult {
  text: string
  steps: number
  toolCalls: string[]
}

export interface GenerateOptions {
  vaultStore?: VaultStore
  contextRequest?: ContextRequest
  onStatus?: (status: string) => void | Promise<void>
  onToolStart?: (toolName: string) => void
  onToolFinish?: (toolName: string, durationMs: number, success: boolean) => void
  onStepFinish?: (stepNumber: number, toolNames: string[]) => void
  onResult?: (result: Result<GenerateResult>) => Promise<void> | void
}

export interface ToolDef {
  description: string
  inputSchema: unknown
  executeWithSandbox: (sandbox: AgentSandbox, input: never) => Promise<unknown>
}

export interface AgentCardOutput {
  name: string
  description: string
  url: string
  version: string
  capabilities: {
    streaming: boolean
    pushNotifications: boolean
  }
  skills: Array<{
    id: string
    name: string
    description: string
  }>
}

export interface Runtime {
  /** Map<name, AgentCard> — lazy-loaded, cached. Call load() to populate. */
  agents: Map<string, AgentCard>
  /** Map<name, ToolDef> — all available sandbox tools */
  tools: Map<string, ToolDef>
  /** SkillsMap — all discovered skills with domain methods. Live reference, reflects post-start() state. */
  readonly skills: SkillsMap
  /** Load/refresh agents + skills from disk */
  start(): Promise<void>
  /** Get agents indexed by Slack channel */
  byChannel(): Promise<Map<string, AgentCard>>
  /** A2A discovery card */
  card(): AgentCardOutput
  /** Full generate lifecycle */
  generate(agent: AgentCard, prompt: string, options?: GenerateOptions): Promise<Result<GenerateResult>>
}

// ---------------------------------------------------------------------------
// Tool definitions (sandbox-bound)
// ---------------------------------------------------------------------------

const DEFAULT_REPO_URL = 'https://github.com/synerops/syner.git'
const DEFAULT_BRANCH = 'main'

function buildToolDefs(): Map<string, ToolDef> {
  const map = new Map<string, ToolDef>()
  map.set('Bash', {
    description: 'Execute a command in the sandbox shell',
    inputSchema: bashInputSchema,
    executeWithSandbox: executeBashWithSandbox as ToolDef['executeWithSandbox'],
  })
  map.set('Fetch', {
    description: 'Fetch URL content as markdown (truncated to 50k chars)',
    inputSchema: fetchInputSchema,
    executeWithSandbox: executeFetchWithSandbox as ToolDef['executeWithSandbox'],
  })
  map.set('Read', {
    description: 'Read a file from the sandbox filesystem',
    inputSchema: readInputSchema,
    executeWithSandbox: executeReadWithSandbox as ToolDef['executeWithSandbox'],
  })
  map.set('Write', {
    description: 'Write content to a file (creates parent directories if needed)',
    inputSchema: writeInputSchema,
    executeWithSandbox: executeWriteWithSandbox as ToolDef['executeWithSandbox'],
  })
  map.set('Glob', {
    description: 'Find files matching a glob pattern',
    inputSchema: globInputSchema,
    executeWithSandbox: executeGlobWithSandbox as ToolDef['executeWithSandbox'],
  })
  map.set('Grep', {
    description: 'Search file contents with regex',
    inputSchema: grepInputSchema,
    executeWithSandbox: executeGrepWithSandbox as ToolDef['executeWithSandbox'],
  })
  return map
}

// ---------------------------------------------------------------------------
// createRuntime
// ---------------------------------------------------------------------------

function getProjectRoot(): string {
  return path.resolve(process.cwd(), '../..')
}

export function createRuntime(config?: RuntimeConfig): Runtime {
  const projectRoot = getProjectRoot()
  const skillIndex = config?.skills?.index ?? path.join(projectRoot, 'public/.well-known/skills/index.json')
  const skillDirs = config?.skills?.dirs ?? [
    path.join(projectRoot, 'skills'),
    path.join(projectRoot, 'apps/bot/skills'),
    path.join(projectRoot, 'apps/dev/skills'),
    path.join(projectRoot, 'apps/vaults/skills'),
  ]

  // --- Maps ---
  const agents_ = new Map<string, AgentCard>()
  const tools_ = buildToolDefs()
  const skillLoader = new SkillLoader({ indexPath: skillIndex, skillDirs })
  let skills_ = new SkillsMap()
  const runAdapter = new VercelRunAdapter()

  /** Load/refresh agents + skills from disk into the Maps */
  async function start(): Promise<void> {
    // Load skills index
    await skillLoader.load()
    skills_ = skillLoader.skills

    // Load agents
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

  /** A2A discovery card */
  function card(): AgentCardOutput {
    const agent = agents_.get('bot')

    return {
      name: agent?.name || 'syner',
      description: agent?.description || '',
      url: process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : 'http://localhost:3001',
      version: '0.1.0',
      capabilities: { streaming: false, pushNotifications: false },
      skills: [...skills_.values()].map(s => ({
        id: s.name,
        name: s.name,
        description: s.description,
      })),
    }
  }

  /** Full generate lifecycle */
  async function generate(
    agent: AgentCard,
    prompt: string,
    options?: GenerateOptions,
  ): Promise<Result<GenerateResult>> {
    const onStatus = options?.onStatus ?? (() => {})
    await onStatus('Thinking...')
    const startTime = Date.now()

    // 1. Resolve model
    const tier = agent.model ?? 'sonnet'
    const { model, fallbacks, modelId } = resolveModel(tier)

    // 2. Lazy sandbox (created on first tool use, shared per generate call)
    let sandbox: AgentSandbox | null = null
    let initPromise: Promise<AgentSandbox> | null = null

    async function ensureSandbox(): Promise<AgentSandbox> {
      if (sandbox) return sandbox
      if (initPromise) return initPromise
      initPromise = (async () => {
        try {
          await onStatus('Cloning repository...')
          const result = await createAgentSandbox({
            repoUrl: DEFAULT_REPO_URL,
            branch: DEFAULT_BRANCH,
            workdir: 'workspace',
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

    // 3. Filter tools from runtime.tools by agent.tools
    const activeTools: Record<string, Tool> = {}

    if (agent.tools && agent.tools.length > 0) {
      for (const name of agent.tools) {
        const trimmed = name.trim()
        if (['Skill', 'Task'].includes(trimmed)) continue

        const def = tools_.get(trimmed)
        if (!def) continue

        activeTools[trimmed] = tool({
          description: def.description,
          inputSchema: def.inputSchema as never,
          execute: async (input) => {
            const sb = await ensureSandbox()
            return def.executeWithSandbox(sb, input as never)
          },
        })
      }
    }

    // 4. Skill tool (execute: true + prepareStep injection)
    if (skills_.size > 0) {
      activeTools.Skill = createSkillTool(skillLoader)
    }

    // 5. Task tool (RunAdapter)
    activeTools.Task = createTaskTool({ runAdapter })

    // 6. System prompt (agent.instructions + skill descriptions)
    const skillDescriptions = skillLoader.describeSkills()
    const instructions = skillDescriptions
      ? `${agent.instructions}\n\n${skillDescriptions}`
      : agent.instructions

    // 7. Preprocess prompt (/skillname detection)
    const processedPrompt = await preprocessPrompt(skillLoader, prompt)

    // 8. Vault context (optional)
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

    // 9. OSProtocol wrapping
    const context = createContext({
      agentId: agent.name,
      skillRef: `runtime:${agent.name}`,
      loaded: loadedSources,
      missing: missingTopics,
    })

    const action = createAction({
      description: `Generate response for: ${prompt.slice(0, 100)}`,
      expectedEffects: [{ description: 'Response generated', verifiable: true }],
    })

    const toolCallsList: string[] = []

    // 10. Execute via ToolLoopAgent
    const loopAgent = new ToolLoopAgent({
      id: agent.name,
      model,
      instructions,
      tools: activeTools as ToolSet,
      stopWhen: stepCountIs(10),
      prepareStep: createPrepareStep(skillLoader) as never,
      providerOptions: {
        gateway: { models: fallbacks },
      },
    })

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
          const toolNames = toolCalls?.map((tc: { toolName: string }) => tc.toolName) || []
          options?.onStepFinish?.(stepNumber, toolNames)
        },
      })

      const usedTools = toolCallsList.length > 0
      console.log(`[Runtime][${agent.name}] model=${modelId} tier=${tier} path=${usedTools ? 'tools' : 'direct'} steps=${result.steps.length} tools=[${toolCallsList}]`)

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
      console.error(`[Runtime][${agent.name}] model=${modelId} tier=${tier} ERROR:`, error instanceof Error ? error.message : error)
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
    agents: agents_,
    tools: tools_,
    get skills() { return skills_ },
    start,
    byChannel,
    card,
    generate,
  }
}
