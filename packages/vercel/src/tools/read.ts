import { Sandbox } from '@vercel/sandbox'
import { z } from 'zod'

export const readInputSchema = z.object({
  file_path: z.string().describe('Absolute path to the file to read'),
  offset: z.number().optional().describe('Line number to start reading from (1-indexed)'),
  limit: z.number().optional().describe('Number of lines to read'),
})

export type ReadInput = z.infer<typeof readInputSchema>

export async function executeRead(
  sandbox: Sandbox,
  { file_path, offset, limit }: ReadInput
): Promise<string> {
  // Build command: cat -n file | tail -n +offset | head -n limit
  let cmd = `cat -n '${file_path}'`
  if (offset && offset > 1) {
    cmd += ` | tail -n +${offset}`
  }
  if (limit) {
    cmd += ` | head -n ${limit}`
  }

  const result = await sandbox.runCommand('sh', ['-c', cmd])
  const stdout = await result.stdout()
  const stderr = await result.stderr()
  return result.exitCode === 0 ? stdout : `Error: ${stderr || stdout}`
}
