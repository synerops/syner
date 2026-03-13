import { tool } from 'ai'
import { z } from 'zod'
import type { VaultStore } from 'syner/context'

const inputSchema = z.object({
  pattern: z.string().describe('Glob pattern to match files (e.g. "bot/**/*.md", "**/*.md")'),
})

export function createVaultList(store: VaultStore) {
  return tool({
    description: 'List vault files matching a glob pattern. Returns file paths with a preview of each file.',
    inputSchema,
    execute: async ({ pattern }) => {
      const paths = await store.list(pattern)
      const previews = await Promise.all(
        paths.map(async (p: string) => {
          const content = await store.read(p)
          return { path: p, preview: content?.slice(0, 200) ?? '' }
        })
      )
      return { pattern, count: paths.length, files: previews }
    },
  })
}
