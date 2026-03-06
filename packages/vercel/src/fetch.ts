import { tool } from 'ai'
import { Sandbox } from '@vercel/sandbox'
import { z } from 'zod'

const MAX_CHARS = 50000 // ~12-15k tokens

const inputSchema = z.object({
  url: z.string().describe('URL to fetch'),
})

export const Fetch = tool({
  description: 'Fetch URL content as markdown (truncated to ~50k chars)',
  inputSchema,
  execute: async ({ url }: z.infer<typeof inputSchema>) => {
    const sandbox = await Sandbox.create({ runtime: 'node24', timeout: 60000 })
    try {
      const result = await sandbox.runCommand('sh', ['-c', `curl -sL -H 'Accept: text/markdown' '${url}'`])
      const stdout = await result.stdout()
      const stderr = await result.stderr()
      if (result.exitCode !== 0) return `Error: ${stderr || stdout}`
      if (stdout.length > MAX_CHARS) {
        return stdout.slice(0, MAX_CHARS) + `\n\n[Truncated: ${stdout.length - MAX_CHARS} chars omitted]`
      }
      return stdout
    } finally {
      await sandbox.stop()
    }
  },
})
