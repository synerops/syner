import { z } from 'zod'

/**
 * Tool contracts — SDK defines the interface, adapters implement execute.
 *
 * Each tool has: name, description, inputSchema (zod).
 * No execute — that's the adapter's job (@syner/vercel, @syner/docker, etc.)
 */

export const Tools = {
  Bash: {
    name: 'Bash' as const,
    description: 'Execute a command in isolated environment',
    inputSchema: z.object({
      command: z.string().describe('Command to execute'),
    }),
  },
  Read: {
    name: 'Read' as const,
    description: 'Read a file from the filesystem',
    inputSchema: z.object({
      file_path: z.string().describe('Absolute path to the file to read'),
    }),
  },
  Write: {
    name: 'Write' as const,
    description: 'Write content to a file (creates parent directories if needed)',
    inputSchema: z.object({
      file_path: z.string().describe('Absolute path to the file to write'),
      content: z.string().describe('Content to write'),
    }),
  },
  Edit: {
    name: 'Edit' as const,
    description: 'Replace text in a file',
    inputSchema: z.object({
      file_path: z.string().describe('Absolute path to the file to edit'),
      old_string: z.string().describe('Text to replace'),
      new_string: z.string().describe('Replacement text'),
    }),
  },
  Glob: {
    name: 'Glob' as const,
    description: 'Find files matching a glob pattern',
    inputSchema: z.object({
      pattern: z.string().describe('Glob pattern to match'),
      path: z.string().optional().describe('Directory to search in'),
    }),
  },
  Grep: {
    name: 'Grep' as const,
    description: 'Search file contents with regex',
    inputSchema: z.object({
      pattern: z.string().describe('Regex pattern to search for'),
      path: z.string().optional().describe('File or directory to search in'),
    }),
  },
  Fetch: {
    name: 'Fetch' as const,
    description: 'Fetch URL content as markdown (truncated to 50k chars)',
    inputSchema: z.object({
      url: z.string().describe('URL to fetch'),
    }),
  },
  Skill: {
    name: 'Skill' as const,
    description: 'Load specialized instructions for a task',
    inputSchema: z.object({
      name: z.string().describe('Skill name to load'),
    }),
  },
  Task: {
    name: 'Task' as const,
    description: 'Start a durable task for complex work that needs persistence and status tracking',
    inputSchema: z.object({
      prompt: z.string().describe('Task description'),
      scope: z.enum(['none', 'app', 'project', 'targeted', 'full']).optional().default('none').describe('Context scope'),
      app: z.string().optional().describe('App name when scope is "app"'),
    }),
  },
} as const

/** All known tool names */
export type ToolName = keyof typeof Tools
