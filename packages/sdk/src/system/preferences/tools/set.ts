/**
 * Set preference tool
 */

import { tool } from 'ai'
import { z } from 'zod'

// In-memory preferences store (placeholder for actual implementation)
const preferences: Record<string, unknown> = {}

const inputSchema = z.object({
  key: z.string().describe('Preference key to set'),
  value: z.unknown().describe('Value to store'),
})

export const set = tool({
  description: 'Set a user preference value',
  inputSchema,
  execute: async (args: z.infer<typeof inputSchema>) => {
    const previousValue = preferences[args.key]
    preferences[args.key] = args.value
    return {
      key: args.key,
      value: args.value,
      previousValue: previousValue ?? null,
    }
  },
})

export default set
