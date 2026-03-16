import {
  createAgentSandbox,
  stopSandbox,
  // Input schemas (zod)
  bashInputSchema,
  fetchInputSchema,
  readInputSchema,
  writeInputSchema,
  globInputSchema,
  grepInputSchema,
  // Sandbox-bound execute functions
  executeBashWithSandbox,
  executeFetchWithSandbox,
  executeReadWithSandbox,
  executeWriteWithSandbox,
  executeGlobWithSandbox,
  executeGrepWithSandbox,
  type SandboxConfig,
  type AgentSandbox,
} from '@syner/vercel'
import { tool, type Tool } from 'ai'

// Default repo configuration
const DEFAULT_REPO_URL = 'https://github.com/synerops/syner.git'
const DEFAULT_BRANCH = 'main'

export interface ToolSession {
  tools: Record<string, Tool>
  workdir: string
  cleanup: () => Promise<void>
}

// Tool definitions: real zod schemas + descriptions + sandbox execute functions
const TOOL_DEFS = {
  Bash: {
    description: 'Execute a command in the sandbox shell',
    inputSchema: bashInputSchema,
    executeWithSandbox: executeBashWithSandbox,
  },
  Fetch: {
    description: 'Fetch URL content as markdown (truncated to 50k chars)',
    inputSchema: fetchInputSchema,
    executeWithSandbox: executeFetchWithSandbox,
  },
  Read: {
    description: 'Read a file from the sandbox filesystem',
    inputSchema: readInputSchema,
    executeWithSandbox: executeReadWithSandbox,
  },
  Write: {
    description: 'Write content to a file (creates parent directories if needed)',
    inputSchema: writeInputSchema,
    executeWithSandbox: executeWriteWithSandbox,
  },
  Glob: {
    description: 'Find files matching a glob pattern',
    inputSchema: globInputSchema,
    executeWithSandbox: executeGlobWithSandbox,
  },
  Grep: {
    description: 'Search file contents with regex',
    inputSchema: grepInputSchema,
    executeWithSandbox: executeGrepWithSandbox,
  },
} as const

type ToolDefName = keyof typeof TOOL_DEFS

/**
 * Create tools with lazy sandbox initialization.
 *
 * Each tool is created with its real zod schema and description (so the LLM
 * sees them and knows what parameters to pass). The execute function lazily
 * initializes the sandbox on first invocation and delegates to the real
 * sandbox-bound execute function.
 *
 * If the LLM never calls a tool, no sandbox is created.
 */
export function createLazyToolSession(
  toolNames: string[],
  config?: Partial<SandboxConfig>,
  onStatus?: (status: string) => void | Promise<void>,
): ToolSession {
  const sandboxConfig: SandboxConfig = {
    repoUrl: config?.repoUrl || DEFAULT_REPO_URL,
    branch: config?.branch || DEFAULT_BRANCH,
    workdir: config?.workdir || 'workspace',
    timeout: config?.timeout || 300000,
  }

  // Lazy state — sandbox created on first tool call
  let sandbox: AgentSandbox | null = null
  let initPromise: Promise<AgentSandbox> | null = null
  let resolvedWorkdir = '.'

  async function ensureSandbox(): Promise<AgentSandbox> {
    if (sandbox) return sandbox
    if (initPromise) return initPromise

    initPromise = (async () => {
      try {
        await onStatus?.('Cloning repository...')
        const result = await createAgentSandbox(sandboxConfig)
        sandbox = result.sandbox
        resolvedWorkdir = result.workdir
        return sandbox
      } finally {
        initPromise = null
      }
    })()

    return initPromise
  }

  // Build lazy tools with real schemas
  const lazyTools: Record<string, Tool> = {}

  for (const name of toolNames) {
    const trimmed = name.trim()
    if (['Skill', 'Workflow'].includes(trimmed)) continue

    const def = TOOL_DEFS[trimmed as ToolDefName]
    if (!def) {
      console.warn(`[LazyTools] Unknown tool: ${trimmed}`)
      continue
    }

    lazyTools[trimmed] = tool({
      description: def.description,
      inputSchema: def.inputSchema as never,
      execute: async (input) => {
        const sb = await ensureSandbox()
        return def.executeWithSandbox(sb, input as never)
      },
    })
  }

  return {
    tools: lazyTools,
    get workdir() { return resolvedWorkdir },
    cleanup: async () => {
      if (sandbox) {
        await stopSandbox(sandbox)
      }
    },
  }
}

/**
 * List all available tool names
 */
export function listTools(): string[] {
  return Object.keys(TOOL_DEFS)
}
