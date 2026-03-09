import { tool } from 'ai'
import { Sandbox } from '@vercel/sandbox'
import { z } from 'zod'

export const bashInputSchema = z.object({
  command: z.string().describe('Command to execute'),
})

export type BashInput = z.infer<typeof bashInputSchema>

/**
 * Execute bash with a provided sandbox (for session reuse)
 */
export async function executeBashWithSandbox(
  sandbox: Sandbox,
  { command }: BashInput
): Promise<string> {
  const result = await sandbox.runCommand('sh', ['-c', command])
  const stdout = await result.stdout()
  const stderr = await result.stderr()
  return result.exitCode === 0 ? stdout : `Exit ${result.exitCode}: ${stderr || stdout}`
}

/**
 * Execute bash with a new ephemeral sandbox (standalone use)
 */
export async function executeBash(input: BashInput): Promise<string> {
  const sandbox = await Sandbox.create({ runtime: 'node24', timeout: 60000 })
  try {
    return await executeBashWithSandbox(sandbox, input)
  } finally {
    await sandbox.stop()
  }
}

/**
 * Standalone Bash tool (creates its own sandbox)
 */
export const Bash = tool({
  description: 'Execute a command in isolated sandbox',
  inputSchema: bashInputSchema,
  execute: executeBash,
})

/**
 * Create a Bash tool that uses a shared sandbox
 */
export function createBashTool(sandbox: Sandbox) {
  return tool({
    description: 'Execute a command in isolated sandbox',
    inputSchema: bashInputSchema,
    execute: (input) => executeBashWithSandbox(sandbox, input),
  })
}
