/**
 * Get environment tool
 */

import { tool } from 'ai'
import { z } from 'zod'
import { env } from '../index'

const inputSchema = z.object({})

export const get = tool({
  description: 'Get current environment and sandbox information',
  inputSchema,
  execute: async (_args: z.infer<typeof inputSchema>) => {
    const sandbox = env.getSandbox()
    return {
      hasSandbox: sandbox !== null,
      sandbox: sandbox
        ? {
            id: sandbox.id,
            status: sandbox.status,
          }
        : null,
    }
  },
})

export default get
