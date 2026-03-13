import { tool } from 'ai'
import { z } from 'zod'
import type { VaultStore } from '@syner/sdk/context'

const inputSchema = z.object({
  path: z.string().describe('Vault file path relative to vault root (e.g. "bot/notes/q1.md")'),
})

export function createVaultDelete(store: VaultStore) {
  return tool({
    description: 'Delete a vault file. No-op if the file does not exist.',
    inputSchema,
    execute: async ({ path }) => {
      await store.delete(path)
      return { path, deleted: true }
    },
  })
}
