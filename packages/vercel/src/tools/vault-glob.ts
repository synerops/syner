import { tool } from 'ai'
import { z } from 'zod'
import type { VaultStore } from '@syner/sdk/context'

const inputSchema = z.object({
  pattern: z.string().describe('Glob pattern to match files (e.g. "bot/**/*.md", "**/*.md")'),
})

export function createVaultGlob(store: VaultStore) {
  return tool({
    description: 'Find vault files matching a glob pattern. Returns paths only (no content).',
    inputSchema,
    execute: async ({ pattern }) => {
      const paths = await store.list(pattern)
      return { pattern, count: paths.length, paths }
    },
  })
}
