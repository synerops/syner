import { tool } from 'ai'
import { Sandbox } from '@vercel/sandbox'
import { z } from 'zod'

const MAX_CHARS = 50000 // ~12-15k tokens

export const fetchInputSchema = z.object({
  url: z.string().describe('URL to fetch'),
})

export type FetchInput = z.infer<typeof fetchInputSchema>

/**
 * Execute fetch with a provided sandbox (for session reuse)
 */
export async function executeFetchWithSandbox(
  sandbox: Sandbox,
  { url }: FetchInput
): Promise<string> {
  const result = await sandbox.runCommand('sh', ['-c', `curl -sL -H 'Accept: text/markdown' '${url}'`])
  const stdout = await result.stdout()
  const stderr = await result.stderr()
  if (result.exitCode !== 0) return `Error: ${stderr || stdout}`
  if (stdout.length > MAX_CHARS) {
    return stdout.slice(0, MAX_CHARS) + `\n\n[Truncated: ${stdout.length - MAX_CHARS} chars omitted]`
  }
  return stdout
}

/**
 * Execute fetch with a new ephemeral sandbox (standalone use)
 */
export async function executeFetch(input: FetchInput): Promise<string> {
  const sandbox = await Sandbox.create({ runtime: 'node24', timeout: 60000 })
  try {
    return await executeFetchWithSandbox(sandbox, input)
  } finally {
    await sandbox.stop()
  }
}

/**
 * Standalone Fetch tool (creates its own sandbox)
 */
export const Fetch = tool({
  description: 'Fetch URL content as markdown (truncated to ~50k chars)',
  inputSchema: fetchInputSchema,
  execute: executeFetch,
})

/**
 * Create a Fetch tool that uses a shared sandbox
 */
export function createFetchTool(sandbox: Sandbox) {
  return tool({
    description: 'Fetch URL content as markdown (truncated to ~50k chars)',
    inputSchema: fetchInputSchema,
    execute: (input) => executeFetchWithSandbox(sandbox, input),
  })
}
