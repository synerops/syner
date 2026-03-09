import { tool } from 'ai'
import { Sandbox } from '@vercel/sandbox'
import { z } from 'zod'

export const grepInputSchema = z.object({
  pattern: z.string().describe('Regex pattern to search for'),
  path: z.string().optional().describe('File or directory to search in'),
  glob: z.string().optional().describe('Filter files by glob pattern (e.g., "*.ts")'),
  output_mode: z.enum(['content', 'files_with_matches', 'count']).optional()
    .describe('Output mode: content (default), files_with_matches, or count'),
  '-i': z.boolean().optional().describe('Case insensitive search'),
  '-n': z.boolean().optional().describe('Show line numbers'),
  '-A': z.number().optional().describe('Lines to show after match'),
  '-B': z.number().optional().describe('Lines to show before match'),
  '-C': z.number().optional().describe('Lines to show around match'),
})

export type GrepInput = z.infer<typeof grepInputSchema>

/**
 * Execute grep with a provided sandbox (for session reuse)
 */
export async function executeGrepWithSandbox(
  sandbox: Sandbox,
  params: GrepInput
): Promise<string> {
  const flags: string[] = []

  // Output mode
  if (params.output_mode === 'files_with_matches') flags.push('-l')
  else if (params.output_mode === 'count') flags.push('-c')

  // Options
  if (params['-i']) flags.push('-i')
  if (params['-n'] !== false) flags.push('-n') // default true
  if (params['-A']) flags.push(`-A ${params['-A']}`)
  if (params['-B']) flags.push(`-B ${params['-B']}`)
  if (params['-C']) flags.push(`-C ${params['-C']}`)

  // Glob filter
  if (params.glob) flags.push(`--glob '${params.glob}'`)

  const searchPath = params.path || '.'
  const cmd = `rg ${flags.join(' ')} '${params.pattern}' '${searchPath}' 2>/dev/null || grep -r ${flags.filter(f => !f.startsWith('--glob')).join(' ')} '${params.pattern}' '${searchPath}' 2>/dev/null`

  const result = await sandbox.runCommand('sh', ['-c', cmd])
  const stdout = await result.stdout()
  return stdout || 'No matches found'
}

/**
 * Execute grep with a new ephemeral sandbox (standalone use)
 */
export async function executeGrep(input: GrepInput): Promise<string> {
  const sandbox = await Sandbox.create({ runtime: 'node24', timeout: 60000 })
  try {
    return await executeGrepWithSandbox(sandbox, input)
  } finally {
    await sandbox.stop()
  }
}

/**
 * Standalone Grep tool (creates its own sandbox)
 */
export const Grep = tool({
  description: 'Search for pattern in files using regex',
  inputSchema: grepInputSchema,
  execute: executeGrep,
})

/**
 * Create a Grep tool that uses a shared sandbox
 */
export function createGrepTool(sandbox: Sandbox) {
  return tool({
    description: 'Search for pattern in files using regex',
    inputSchema: grepInputSchema,
    execute: (input) => executeGrepWithSandbox(sandbox, input),
  })
}
