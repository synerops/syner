import { tool } from 'ai'
import { Sandbox } from '@vercel/sandbox'
import { z } from 'zod'

const inputSchema = z.object({
  command: z.string().describe('Command to execute'),
})

export const Bash = tool({
  description: 'Execute a command in isolated sandbox',
  inputSchema,
  execute: async ({ command }: z.infer<typeof inputSchema>) => {
    const sandbox = await Sandbox.create({ runtime: 'node24', timeout: 60000 })
    try {
      const result = await sandbox.runCommand('sh', ['-c', command])
      const stdout = await result.stdout()
      const stderr = await result.stderr()
      return result.exitCode === 0 ? stdout : `Exit ${result.exitCode}: ${stderr || stdout}`
    } finally {
      await sandbox.stop()
    }
  },
})
