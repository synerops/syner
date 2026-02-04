/**
 * Read file tool (placeholder implementation)
 *
 * This is a base implementation. Extensions like @syner/vercel
 * provide concrete implementations with actual file system access.
 */

import { tool } from 'ai'
import { z } from 'zod'

export const read = tool({
  description: 'Read file contents from the filesystem',
  inputSchema: z.object({
    path: z.string().describe('Path to the file to read'),
    encoding: z.enum(['utf-8', 'base64']).optional().describe('File encoding (default: utf-8)'),
  }),
  execute: async ({ path }) => {
    // This is a placeholder - concrete implementations are provided by extensions
    return {
      success: false,
      error: `File system not available. Use an extension like @syner/vercel for file operations. Path: ${path}`,
    }
  },
})

export default read
