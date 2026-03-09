import {
  createAgentSandbox,
  stopSandbox,
  createToolsByName,
  type SandboxConfig,
} from '@syner/vercel'
import type { Tool } from 'ai'

// Default repo configuration
const DEFAULT_REPO_URL = 'https://github.com/synerops/syner.git'
const DEFAULT_BRANCH = 'main'

export interface ToolSession {
  tools: Record<string, Tool>
  workdir: string
  cleanup: () => Promise<void>
}

/**
 * Create tools with a shared sandbox session
 * The sandbox will have the repository cloned and ready to use
 */
export async function createToolSession(
  toolNames?: string[],
  config?: Partial<SandboxConfig>
): Promise<ToolSession> {
  const sandboxConfig: SandboxConfig = {
    repoUrl: config?.repoUrl || DEFAULT_REPO_URL,
    branch: config?.branch || DEFAULT_BRANCH,
    workdir: config?.workdir || 'workspace',
    timeout: config?.timeout || 300000,
  }

  // Create sandbox with repo cloned
  const { sandbox, workdir } = await createAgentSandbox(sandboxConfig)

  // Create tools that use this sandbox
  const tools = toolNames && toolNames.length > 0
    ? createToolsByName(sandbox, toolNames)
    : {}

  return {
    tools,
    workdir,
    cleanup: () => stopSandbox(sandbox),
  }
}

/**
 * List all available tool names
 */
export function listTools(): string[] {
  return ['Bash', 'Fetch', 'Read', 'Write', 'Glob', 'Grep']
}
