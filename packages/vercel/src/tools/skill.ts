import { tool } from 'ai'
import { z } from 'zod'
import type { SkillLoader } from '../skills'

/**
 * Create the Skill tool — what the LLM calls.
 *
 * execute returns true (minimal ack) so the loop continues.
 * prepareStep on the next step injects the skill content as a user message.
 */
export function createSkillTool(loader: SkillLoader) {
  const skillList = loader.names
    .map(name => {
      const entry = loader.getEntry(name)
      return `- ${name}: ${entry?.description || ''}`
    })
    .join('\n')

  return tool({
    description: loader.names.length > 0
      ? `Load specialized instructions for a task. Available skills:\n${skillList}`
      : 'Load specialized instructions. No skills available.',
    inputSchema: z.object({
      name: z.string().describe('Skill name to load'),
    }),
    execute: async () => true,
  })
}

/**
 * prepareStep handler — detects Skill tool calls and injects content.
 */
export function createPrepareStep(loader: SkillLoader) {
  return async ({ steps, messages }: { steps: Array<{ toolCalls?: Array<{ toolName: string; toolCallId: string; args: Record<string, unknown> }> }>; messages: Array<Record<string, unknown>>; stepNumber: number; model: unknown; experimental_context: unknown }) => {
    if (steps.length === 0) return {}

    const lastStep = steps[steps.length - 1]
    const skillCall = lastStep?.toolCalls?.find(
      (tc: { toolName: string }) => tc.toolName === 'Skill'
    )
    if (!skillCall) return {}

    const skillName = skillCall.args.name as string
    if (!loader.has(skillName)) return {}

    const content = await loader.loadContent(skillName)
    if (!content) return {}

    return {
      messages: [
        ...messages,
        {
          role: 'user' as const,
          content: content,
        },
      ],
    }
  }
}

/**
 * Preprocess a prompt — detect /skillname and prepend content.
 *
 * For explicit skill invocations from the user (e.g., Slack `/deploy`).
 * Returns the prompt unchanged if no skill reference found.
 */
export async function preprocessPrompt(loader: SkillLoader, prompt: string): Promise<string> {
  const trimmed = prompt.trim()

  if (trimmed.startsWith('/')) {
    const [command, ...rest] = trimmed.split(/\s+/)
    const skillName = command.slice(1)

    if (loader.has(skillName)) {
      const content = await loader.loadContent(skillName)
      if (content) {
        const args = rest.join(' ')
        const processed = content
          .replace(/\$ARGUMENTS/g, args)
          .replace(/\$(\d+)/g, (_, n) => rest[parseInt(n)] || '')

        return `${processed}\n\n---\n\nUser request: ${args || trimmed}`
      }
    }
  }

  return prompt
}
