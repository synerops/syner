import type { Sandbox } from '@vercel/sandbox'
import type { Tool } from 'ai'

// Re-export all tools
export { Bash, executeBash, createBashTool } from './bash'
export { Fetch, executeFetch, createFetchTool } from './fetch'
export { Read, executeRead, createReadTool } from './read'
export { Write, executeWrite, createWriteTool } from './write'
export { Glob, executeGlob, createGlobTool } from './glob'
export { Grep, executeGrep, createGrepTool } from './grep'

// Import creators for registry
import { createBashTool } from './bash'
import { createFetchTool } from './fetch'
import { createReadTool } from './read'
import { createWriteTool } from './write'
import { createGlobTool } from './glob'
import { createGrepTool } from './grep'

export type ToolName = 'Bash' | 'Fetch' | 'Read' | 'Write' | 'Glob' | 'Grep'

/**
 * Create all tools configured to use a shared sandbox
 */
export function createTools(sandbox: Sandbox): Record<ToolName, Tool> {
  return {
    Bash: createBashTool(sandbox),
    Fetch: createFetchTool(sandbox),
    Read: createReadTool(sandbox),
    Write: createWriteTool(sandbox),
    Glob: createGlobTool(sandbox),
    Grep: createGrepTool(sandbox),
  }
}

/**
 * Create specific tools by name using a shared sandbox
 */
export function createToolsByName(
  sandbox: Sandbox,
  toolNames: string[]
): Record<string, Tool> {
  const allTools = createTools(sandbox)
  const result: Record<string, Tool> = {}

  for (const name of toolNames) {
    const trimmed = name.trim() as ToolName
    if (trimmed in allTools) {
      result[trimmed] = allTools[trimmed]
    } else {
      console.warn(`[Tools] Unknown tool: ${trimmed}`)
    }
  }

  return result
}
