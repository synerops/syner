import { Sandbox } from '@vercel/sandbox'
import { z } from 'zod'

export const bashInputSchema = z.object({
  command: z.string().describe('Command to execute'),
})

export type BashInput = z.infer<typeof bashInputSchema>

export async function executeBash(
  sandbox: Sandbox,
  { command }: BashInput
): Promise<string> {
  const result = await sandbox.runCommand('sh', ['-c', command])
  const stdout = await result.stdout()
  const stderr = await result.stderr()
  return result.exitCode === 0 ? stdout : `Exit ${result.exitCode}: ${stderr || stdout}`
}
