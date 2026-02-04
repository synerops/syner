/**
 * Store memory tool
 */

import { tool } from 'ai'
import { z } from 'zod'

// In-memory store (placeholder for actual persistence)
const memoryStore = new Map<string, { value: unknown; timestamp: number }>()

const inputSchema = z.object({
  key: z.string().describe('Key to store the value under'),
  value: z.unknown().describe('Value to store'),
  scope: z.enum(['session', 'user', 'global']).optional().describe('Memory scope'),
})

export const store = tool({
  description: 'Store information in session memory',
  inputSchema,
  execute: async (args: z.infer<typeof inputSchema>) => {
    const scope = args.scope ?? 'session'
    const scopedKey = `${scope}:${args.key}`
    memoryStore.set(scopedKey, {
      value: args.value,
      timestamp: Date.now(),
    })

    return {
      success: true,
      key: args.key,
      scope,
    }
  },
})

export default store
