import { tool } from 'ai'
import { z } from 'zod'
import type { RunAdapter } from '@syner/osprotocol'

export interface CreateTaskToolOptions {
  /** RunAdapter instance to create Runs through */
  runAdapter: RunAdapter
}

/**
 * Create a Task tool that lets the agent start durable workflows.
 *
 * The agent invokes this when it determines a task needs:
 * - Durability (survives restarts)
 * - Status tracking (long-running)
 * - Delegation to another agent
 *
 * Direct responses (agent just replies) should NOT use this tool.
 * The agent's system prompt guides when to use Task vs respond directly.
 */
export function createTaskTool(options: CreateTaskToolOptions) {
  const { runAdapter } = options

  const inputSchema = z.object({
    prompt: z.string().describe('Task description'),
    scope: z.enum(['none', 'app', 'project', 'targeted', 'full'])
      .optional()
      .default('none')
      .describe('Context scope for the task'),
    app: z.string().optional().describe('App name when scope is "app"'),
  })

  return tool({
    description: [
      'Start a durable task for complex work that needs persistence and status tracking.',
      'Use this when the work is multi-step, long-running, or needs delegation.',
      'Do NOT use for simple questions — respond directly instead.',
    ].join(' '),
    inputSchema,
    execute: async ({ prompt, scope, app }): Promise<string> => {
      try {
        const run = await runAdapter.start({
          prompt,
          context: { scope, app },
        })

        return JSON.stringify({
          runId: run.id,
          status: run.status,
          message: `Task started. Track with runId: ${run.id}`,
        })
      } catch (error) {
        return JSON.stringify({
          error: error instanceof Error ? error.message : String(error),
          message: 'Failed to start task.',
        })
      }
    },
  })
}
