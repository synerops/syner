import { tool } from 'ai'
import { z } from 'zod'
import type { Runtime } from '../runtime'

/**
 * Create an Agent tool that lets an agent invoke another agent inline.
 *
 * Unlike Task (durable, async, fire-and-forget), Agent is synchronous
 * within the current tool loop — it spawns, waits for the response,
 * and returns the result text.
 *
 * Like Claude Code's Agent tool: cross-silo invocation.
 *
 * Errors propagate naturally — ToolLoopAgent catches them and shows
 * the error message to the model, which can retry or report.
 */
export function createAgentTool(runtime: Runtime) {
  return tool({
    description: [
      'Invoke another agent inline and get its response.',
      'Use this for cross-silo queries where you need the result to continue.',
      'The agent runs synchronously — you wait for its response.',
      'For fire-and-forget background work, use Task instead.',
    ].join(' '),
    inputSchema: z.object({
      agent: z.string().describe('Name of the agent to invoke'),
      prompt: z.string().describe('What to ask the agent'),
    }),
    execute: async ({ agent, prompt }): Promise<string> => {
      const target = runtime.agent(agent)
      const result = await target.spawn(prompt)

      return JSON.stringify({
        agent,
        text: result.output?.text ?? '',
        steps: result.output?.steps ?? 0,
        toolCalls: result.output?.toolCalls ?? [],
      })
    },
  })
}
