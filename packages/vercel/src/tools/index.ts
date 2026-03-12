import type { Sandbox } from '@vercel/sandbox'
import type { Tool } from 'ai'
import {
  createContext,
  createAction,
  verify,
  createResult,
} from '@syner/osprotocol'

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
export function createTools(sandbox: Sandbox, options?: CreateToolsOptions): Record<SandboxToolName, Tool> {
  const tools: Record<SandboxToolName, Tool> = {
    Bash: createBashTool(sandbox),
    Fetch: createFetchTool(sandbox),
    Read: createReadTool(sandbox),
    Write: createWriteTool(sandbox),
    Glob: createGlobTool(sandbox),
    Grep: createGrepTool(sandbox),
  }

  if (options?.osprotocol) {
    const agentId = options.agentId || 'sandbox'
    for (const name of Object.keys(tools) as SandboxToolName[]) {
      tools[name] = wrapToolWithOsprotocol(tools[name], name, agentId)
    }
  }

  return tools
}

export interface CreateToolsOptions {
  osprotocol?: boolean
  agentId?: string
}

function wrapToolWithOsprotocol(toolInstance: Tool, toolName: string, agentId: string): Tool {
  const original = toolInstance as Tool & { execute?: (...args: unknown[]) => Promise<unknown> }
  if (!original.execute) return toolInstance

  const originalExecute = original.execute
  return {
    ...toolInstance,
    execute: async (...args: unknown[]) => {
      const startTime = Date.now()
      const context = createContext({
        agentId,
        skillRef: `tool:${toolName}`,
      })
      const action = createAction({
        description: `Execute ${toolName}`,
        expectedEffects: [{ description: `${toolName} completed`, verifiable: true }],
      })

      try {
        const output = await originalExecute(...args)
        const verification = verify(action.expectedEffects, { [`${toolName} completed`]: true })
        return JSON.stringify({
          ...createResult(context, action, verification, output),
          duration: Date.now() - startTime,
        })
      } catch (error) {
        const verification = verify(action.expectedEffects, { [`${toolName} completed`]: false })
        const result = {
          ...createResult(context, action, verification),
          duration: Date.now() - startTime,
        }
        return JSON.stringify({
          ...result,
          error: error instanceof Error ? error.message : String(error),
        })
      }
    },
  } as Tool
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
