import { tool } from 'ai'
import { z } from 'zod'
import { buildSkillContent } from '@syner/sdk/skills'
import type { SkillsMap } from '../skills'

// In-memory cache for loaded skill content
const contentCache = new Map<string, string>()

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
 * Uses buildSkillContent with entry.path for filesystem access,
 * cached in-memory for the lifetime of the process.
 */
export function createPrepareStep(skills: SkillsMap) {
  return async ({ steps, messages }: { steps: Array<{ toolCalls?: Array<{ toolName: string; toolCallId: string; input: Record<string, unknown> }> }>; messages: Array<Record<string, unknown>>; stepNumber: number; model: unknown }) => {
    if (steps.length === 0) return {}

    const lastStep = steps[steps.length - 1]
    const skillCall = lastStep?.toolCalls?.find(
      (tc: { toolName: string }) => tc.toolName === 'Skill'
    )
    if (!skillCall) return {}

    const skillName = skillCall.input.name as string
    const descriptor = skills.get(skillName)
    if (!descriptor) return {}

    // Check cache first
    let content = contentCache.get(skillName)
    if (!content) {
      const result = await buildSkillContent(descriptor)
      if (!result) return {}
      content = result.content
      contentCache.set(skillName, content)
    }

    return {
      messages: [
        ...messages,
        { role: 'user' as const, content },
      ],
    }
  }
}
