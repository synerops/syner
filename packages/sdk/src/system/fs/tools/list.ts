/**
 * List directory tool (placeholder implementation)
 *
 * This is a base implementation. Extensions like @syner/vercel
 * provide concrete implementations with actual file system access.
 */

import { tool } from 'ai'
import { z } from 'zod'

const inputSchema = z.object({
  path: z.string().describe('Path to the directory to list'),
})

export const list = tool({
  description: 'List contents of a directory',
  inputSchema,
  execute: async (args: z.infer<typeof inputSchema>) => {
    // This is a placeholder - concrete implementations are provided by extensions
    return {
      success: false as const,
      error: `File system not available. Use an extension like @syner/vercel for file operations. Path: ${args.path}`,
    }
  },
})

export default list
