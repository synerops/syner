import { tool, type PrepareStepFunction } from 'ai'
import { z } from 'zod'
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
 * Fetches skill content from static /api/skills/[slug] route (pre-rendered at build time).
 * Cached in-memory for the lifetime of the process.
 */
export function createPrepareStep(skills: SkillsMap, getBaseUrl: () => string): PrepareStepFunction {
  return async ({ steps, messages }) => {
    if (steps.length === 0) return {}

    const lastStep = steps[steps.length - 1]
    const skillCall = lastStep?.toolCalls?.find(
      (tc) => tc.toolName === 'Skill'
    )
    if (!skillCall) return {}

    const input = skillCall.input as Record<string, unknown>
    const skillName = input.name as string
    if (!skills.has(skillName)) return {}

    // Check cache first
    let content = contentCache.get(skillName)
    if (!content) {
      try {
        const baseUrl = getBaseUrl()
        const headers: Record<string, string> = {}
        const bypass = process.env.VERCEL_AUTOMATION_BYPASS_SECRET
        if (bypass) headers['x-vercel-protection-bypass'] = bypass

        const slug = (skills.get(skillName)?.metadata?.slug as string) || skillName
        const res = await fetch(`${baseUrl}/api/skills/${slug}`, { headers })
        if (!res.ok) return {}

        const data = await res.json()
        content = data.content
        if (!content) return {}
        contentCache.set(skillName, content)
      } catch {
        return {}
      }
    }

    return {
      messages: [
        ...messages,
        { role: 'user' as const, content },
      ],
    }
  }
}
