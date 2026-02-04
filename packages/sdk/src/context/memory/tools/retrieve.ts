/**
 * Retrieve memory tool
 */

import { tool } from 'ai'
import { z } from 'zod'

// In-memory store (same reference as store.ts in real implementation)
const memoryStore = new Map<string, { value: unknown; timestamp: number }>()

const inputSchema = z.object({
  key: z.string().describe('Key to retrieve'),
  scope: z.enum(['session', 'user', 'global']).optional().describe('Memory scope'),
})

export const retrieve = tool({
  description: 'Retrieve information from session memory',
  inputSchema,
  execute: async (args: z.infer<typeof inputSchema>) => {
    const scope = args.scope ?? 'session'
    const scopedKey = `${scope}:${args.key}`
    const entry = memoryStore.get(scopedKey)

    if (!entry) {
      return {
        found: false,
        key: args.key,
        scope,
        value: null,
      }
    }

    return {
      found: true,
      key: args.key,
      scope,
      value: entry.value,
      storedAt: entry.timestamp,
    }
  },
})

export default retrieve
