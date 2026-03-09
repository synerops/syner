import type { Sandbox } from '@vercel/sandbox'
import type { Tool } from 'ai'

// Re-export all tools
export { Bash, executeBash, createBashTool } from './bash'
export { Fetch, executeFetch, createFetchTool } from './fetch'
export { Read, executeRead, createReadTool } from './read'
export { Write, executeWrite, createWriteTool } from './write'
export { Glob, executeGlob, createGlobTool } from './glob'
export { Grep, executeGrep, createGrepTool } from './grep'
export { createSkillTool, type CreateSkillToolOptions } from './skill'

// Import creators for registry
import { createBashTool } from './bash'
import { createFetchTool } from './fetch'
import { createReadTool } from './read'
import { createWriteTool } from './write'
import { createGlobTool } from './glob'
import { createGrepTool } from './grep'

// Sandbox tools (created automatically with sandbox)
export type SandboxToolName = 'Bash' | 'Fetch' | 'Read' | 'Write' | 'Glob' | 'Grep'

// Special tools (created manually with extra params)
export type SpecialToolName = 'Skill' | 'Task'

// All known tool names
export type ToolName = SandboxToolName | SpecialToolName

/**
 * Create all sandbox tools configured to use a shared sandbox
 */
export function createTools(sandbox: Sandbox): Record<SandboxToolName, Tool> {
  return {
    Bash: createBashTool(sandbox),
    Fetch: createFetchTool(sandbox),
    Read: createReadTool(sandbox),
    Write: createWriteTool(sandbox),
    Glob: createGlobTool(sandbox),
    Grep: createGrepTool(sandbox),
  }
}

// Tools that are handled specially (not created from sandbox alone)
const SPECIAL_TOOLS = new Set<string>(['Skill', 'Task'])

/**
 * Create specific tools by name using a shared sandbox
 *
 * Note: Skill and Task are special tools that require additional params.
 * They are silently skipped here and should be added manually.
 */
export function createToolsByName(
  sandbox: Sandbox,
  toolNames: string[]
): Record<string, Tool> {
  const allTools = createTools(sandbox)
  const result: Record<string, Tool> = {}

  for (const name of toolNames) {
    const trimmed = name.trim()

    // Skip special tools (they're added manually with extra params)
    if (SPECIAL_TOOLS.has(trimmed)) {
      continue
    }

    if (trimmed in allTools) {
      result[trimmed] = allTools[trimmed as SandboxToolName]
    } else {
      console.warn(`[Tools] Unknown tool: ${trimmed}`)
    }
  }

  return result
}
