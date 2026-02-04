/**
 * List registry entries tool (placeholder implementation)
 */

import { tool } from 'ai'
import { z } from 'zod'

const inputSchema = z.object({
  type: z.enum(['agents', 'skills', 'all']).optional().describe('Type of entries to list'),
})

export const list = tool({
  description: 'List all registered agents and skills',
  inputSchema,
  execute: async (args: z.infer<typeof inputSchema>) => {
    const type = args.type ?? 'all'

    // Placeholder - actual implementation requires registry instance
    return {
      type,
      agents: [],
      skills: [],
      count: 0,
      message: 'Registry listing not yet implemented',
    }
  },
})

export default list
