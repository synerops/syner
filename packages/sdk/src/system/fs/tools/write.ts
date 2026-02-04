/**
 * Write file tool (placeholder implementation)
 *
 * This is a base implementation. Extensions like @syner/vercel
 * provide concrete implementations with actual file system access.
 */

import { tool } from 'ai'
import { z } from 'zod'

const inputSchema = z.object({
  path: z.string().describe('Path to the file to write'),
  content: z.string().describe('Content to write to the file'),
})

export const write = tool({
  description: 'Write content to a file in the filesystem',
  inputSchema,
  execute: async (args: z.infer<typeof inputSchema>) => {
    // This is a placeholder - concrete implementations are provided by extensions
    return {
      success: false as const,
      error: `File system not available. Use an extension like @syner/vercel for file operations. Path: ${args.path}`,
    }
  },
})

export default write
