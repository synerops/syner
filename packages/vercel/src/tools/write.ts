import { tool } from 'ai'
import { Sandbox } from '@vercel/sandbox'
import { z } from 'zod'

export const writeInputSchema = z.object({
  file_path: z.string().describe('Absolute path to the file to write'),
  content: z.string().describe('Content to write to the file'),
})

export type WriteInput = z.infer<typeof writeInputSchema>

/**
 * Execute write with a provided sandbox (for session reuse)
 */
export async function executeWriteWithSandbox(
  sandbox: Sandbox,
  { file_path, content }: WriteInput
): Promise<string> {
  // Ensure parent directory exists, then write via heredoc
  const cmd = `mkdir -p "$(dirname '${file_path}')" && cat <<'SYNER_EOF' > '${file_path}'
${content}
SYNER_EOF`

  const result = await sandbox.runCommand('sh', ['-c', cmd])
  const stderr = await result.stderr()
  return result.exitCode === 0 ? `Written to ${file_path}` : `Error: ${stderr}`
}

/**
 * Execute write with a new ephemeral sandbox (standalone use)
 */
export async function executeWrite(input: WriteInput): Promise<string> {
  const sandbox = await Sandbox.create({ runtime: 'node24', timeout: 60000 })
  try {
    return await executeWriteWithSandbox(sandbox, input)
  } finally {
    await sandbox.stop()
  }
}

/**
 * Standalone Write tool (creates its own sandbox)
 */
export const Write = tool({
  description: 'Write content to a file (creates parent directories if needed)',
  inputSchema: writeInputSchema,
  execute: executeWrite,
})

/**
 * Create a Write tool that uses a shared sandbox
 */
export function createWriteTool(sandbox: Sandbox) {
  return tool({
    description: 'Write content to a file (creates parent directories if needed)',
    inputSchema: writeInputSchema,
    execute: (input) => executeWriteWithSandbox(sandbox, input),
  })
}
