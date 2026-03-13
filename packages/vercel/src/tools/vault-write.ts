import { tool } from 'ai'
import { z } from 'zod'
import type { VaultStore } from 'syner/context'

const inputSchema = z.object({
  path: z.string().describe('Vault file path relative to vault root (e.g. "bot/notes/q1.md")'),
  content: z.string().describe('Content to write to the file'),
})

export function createVaultWrite(store: VaultStore) {
  return tool({
    description: 'Write content to a vault file. Creates parent directories if needed. Overwrites existing files.',
    inputSchema,
    execute: async ({ path, content }) => {
      await store.write(path, content)
      return { path, written: true }
    },
  })
}
