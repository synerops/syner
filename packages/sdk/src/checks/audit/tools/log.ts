/**
 * Audit log tool
 */

import { tool } from 'ai'
import { z } from 'zod'

// In-memory audit log (placeholder for actual persistence)
const auditLog: Array<{ timestamp: number; action: string; details: unknown }> = []

const inputSchema = z.object({
  action: z.string().describe('Action being performed'),
  details: z.unknown().optional().describe('Additional details about the action'),
})

export const log = tool({
  description: 'Log an action to the audit trail',
  inputSchema,
  execute: async (args: z.infer<typeof inputSchema>) => {
    const entry = {
      timestamp: Date.now(),
      action: args.action,
      details: args.details,
    }
    auditLog.push(entry)

    return {
      success: true,
      entryId: auditLog.length - 1,
      timestamp: entry.timestamp,
    }
  },
})

export default log
