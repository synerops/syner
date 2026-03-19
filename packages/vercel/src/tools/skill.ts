import { tool } from 'ai'
import { z } from 'zod'
import type { SkillsMap } from '../skills'
import { loadSkillContent } from '../skills/loader'

/**
 * Create the Skill tool — what the LLM calls.
 *
 * execute returns true (minimal ack) so the loop continues.
 * prepareStep on the next step injects the skill content as a user message.
 */
export function createSkillTool(skills: SkillsMap) {
  const skillList = [...skills.values()]
    .map(s => `- ${s.name}: ${s.description}`)
    .join('\n')

  return tool({
    description: skills.size > 0
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
 *
 * Reads pre-rendered content from .well-known/skills/{name}.json (static asset).
 * Uses in-memory cache — first read hits disk, subsequent reads are free.
 */
export function createPrepareStep(skills: SkillsMap, skillsDir: string) {
  return async ({ steps, messages }: { steps: Array<{ toolCalls?: Array<{ toolName: string; toolCallId: string; args: Record<string, unknown> }> }>; messages: Array<Record<string, unknown>>; stepNumber: number; model: unknown; experimental_context: unknown }) => {
    if (steps.length === 0) return {}

    const lastStep = steps[steps.length - 1]
    const skillCall = lastStep?.toolCalls?.find(
      (tc: { toolName: string }) => tc.toolName === 'Skill'
    )
    if (!skillCall) return {}

    const skillName = skillCall.args.name as string
    if (!skills.has(skillName)) return {}

    const content = await loadSkillContent(skillsDir, skillName)
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
