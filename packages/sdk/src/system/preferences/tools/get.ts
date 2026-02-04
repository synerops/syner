/**
 * Get preference tool
 */

import { tool } from 'ai'
import { z } from 'zod'

// In-memory preferences store (placeholder for actual implementation)
const preferences: Record<string, unknown> = {}

const inputSchema = z.object({
  key: z.string().describe('Preference key to retrieve'),
  defaultValue: z.unknown().optional().describe('Default value if not set'),
})

export const get = tool({
  description: 'Get a user preference value',
  inputSchema,
  execute: async (args: z.infer<typeof inputSchema>) => {
    const value = preferences[args.key] ?? args.defaultValue ?? null
    return {
      key: args.key,
      value,
      exists: args.key in preferences,
    }
  },
})

export default get
