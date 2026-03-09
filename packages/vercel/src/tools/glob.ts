import { tool } from 'ai'
import { Sandbox } from '@vercel/sandbox'
import { z } from 'zod'

export const globInputSchema = z.object({
  pattern: z.string().describe('Glob pattern to match files (e.g., "**/*.ts", "*.md")'),
  path: z.string().optional().describe('Directory to search in (default: current directory)'),
})

export type GlobInput = z.infer<typeof globInputSchema>

/**
 * Execute glob with a provided sandbox (for session reuse)
 */
export async function executeGlobWithSandbox(
  sandbox: Sandbox,
  { pattern, path }: GlobInput
): Promise<string> {
  const searchPath = path || '.'
  // Use find with -name for simple patterns, or globstar for ** patterns
  let cmd: string
  if (pattern.includes('**')) {
    // Enable globstar and use ls with pattern
    cmd = `cd '${searchPath}' && shopt -s globstar && ls -1 ${pattern} 2>/dev/null | sort`
  } else {
    cmd = `find '${searchPath}' -type f -name '${pattern}' 2>/dev/null | sort`
  }

  const result = await sandbox.runCommand('bash', ['-c', cmd])
  const stdout = await result.stdout()
  const stderr = await result.stderr()
  if (result.exitCode !== 0 && stderr) {
    return `Error: ${stderr}`
  }
  return stdout || 'No files found'
}

/**
 * Execute glob with a new ephemeral sandbox (standalone use)
 */
export async function executeGlob(input: GlobInput): Promise<string> {
  const sandbox = await Sandbox.create({ runtime: 'node24', timeout: 60000 })
  try {
    return await executeGlobWithSandbox(sandbox, input)
  } finally {
    await sandbox.stop()
  }
}

/**
 * Standalone Glob tool (creates its own sandbox)
 */
export const Glob = tool({
  description: 'Find files matching a glob pattern',
  inputSchema: globInputSchema,
  execute: executeGlob,
})

/**
 * Create a Glob tool that uses a shared sandbox
 */
export function createGlobTool(sandbox: Sandbox) {
  return tool({
    description: 'Find files matching a glob pattern',
    inputSchema: globInputSchema,
    execute: (input) => executeGlobWithSandbox(sandbox, input),
  })
}
