import { Sandbox } from '@vercel/sandbox'
import { z } from 'zod'

export const writeInputSchema = z.object({
  file_path: z.string().describe('Absolute path to the file to write'),
  content: z.string().describe('Content to write to the file'),
})

export type WriteInput = z.infer<typeof writeInputSchema>

export async function executeWrite(
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
