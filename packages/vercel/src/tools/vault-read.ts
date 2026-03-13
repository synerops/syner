import { tool } from 'ai'
import { z } from 'zod'
import type { VaultStore } from 'syner/context'

const inputSchema = z.object({
  path: z.string().describe('Vault file path relative to vault root (e.g. "bot/notes/q1.md")'),
})

export function createVaultRead(store: VaultStore) {
  return tool({
    description: 'Read a vault file by path. Returns the file content or an error if not found.',
    inputSchema,
    execute: async ({ path }) => {
      const content = await store.read(path)
      if (content === null) return { error: `Vault file not found: ${path}` }
      return { path, content }
    },
  })
}
