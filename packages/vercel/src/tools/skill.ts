import { tool, ToolLoopAgent, stepCountIs, type LanguageModel, type Tool } from 'ai'
import { z } from 'zod'
import { loadSkill, buildSkillInstructions, type SkillConfig } from '../skills/loader'
import {
  createContext,
  createAction,
  verify,
  createResult,
  type OspResult,
} from '@syner/osprotocol'

export interface CreateSkillToolOptions {
  /** Repository root path in the sandbox */
  repoRoot: string
  /** List of skill names this agent can use */
  availableSkills: string[]
  /** Tools available to the subagent */
  tools: Record<string, Tool>
  /** Model to use for subagent (already instantiated) */
  model: LanguageModel
}

/**
 * Create a Skill tool that invokes skills as subagents (fork mode)
 *
 * The agent calls this tool to delegate work to a skill.
 * The skill runs in its own context with its own instructions.
 */
export function createSkillTool(options: CreateSkillToolOptions) {
  const { repoRoot, availableSkills, tools, model } = options

  // Cache loaded skills
  const skillCache = new Map<string, SkillConfig>()

  const inputSchema = z.object({
    name: z.string().describe('Skill name (e.g., create-syner-skill, syner-fix-symlinks)'),
    task: z.string().describe('The task or arguments to pass to the skill'),
  })

  return tool({
    description: `Invoke a skill to handle a specialized task. Available skills: ${availableSkills.join(', ')}`,
    inputSchema,
    execute: async (
      { name, task }: z.infer<typeof inputSchema>,
      { abortSignal }: { abortSignal?: AbortSignal }
    ): Promise<string> => {
      // 1. Validate skill is available
      if (!availableSkills.includes(name)) {
        return `Error: Skill "${name}" not available. Available skills: ${availableSkills.join(', ')}`
      }

      // 2. Load skill (with caching)
      let skill = skillCache.get(name)
      if (!skill) {
        const loadedSkill = await loadSkill(repoRoot, name)
        if (!loadedSkill) {
          return `Error: Skill "${name}" not found in repository`
        }
        skill = loadedSkill
        skillCache.set(name, skill)
      }

      // 3. Build skill instructions with arguments
      const instructions = buildSkillInstructions(skill, task)

      // 4. Determine which tools the subagent can use
      // If skill specifies tools, filter to those; otherwise use all tools
      let subagentTools = tools
      if (skill.tools && skill.tools.length > 0) {
        const allowedTools = new Set(skill.tools.map(t => t.toLowerCase()))
        subagentTools = Object.fromEntries(
          Object.entries(tools).filter(([toolName]) =>
            allowedTools.has(toolName.toLowerCase())
          )
        )
      }

      // 5. Create subagent with skill instructions
      const skillAgent = new ToolLoopAgent({
        id: `skill-${name}`,
        model,
        instructions: `${instructions}\n\n## Working Directory\n\nThe repository is available at: ${repoRoot}`,
        tools: subagentTools,
        stopWhen: stepCountIs(10),
      })

      console.log(`[Skill:${name}] Starting subagent for task: "${task.slice(0, 100)}..."`)

      const startTime = Date.now()

      const context = createContext({
        agentId: `skill-${name}`,
        skillRef: name,
        loaded: [{ type: 'skill' as const, ref: name, summary: skill.description }],
        missing: [],
      })

      const action = createAction({
        description: `Execute skill "${name}": ${task.slice(0, 100)}`,
        expectedEffects: [{ description: 'Skill completed successfully', verifiable: true }],
      })

      try {
        // 6. Execute skill
        const result = await skillAgent.generate({
          prompt: task,
          abortSignal,
        })

        const output = result.text || 'Skill completed with no output'
        const verification = verify(action.expectedEffects, { 'Skill completed successfully': true })

        const ospResult: OspResult<string> = {
          ...createResult(context, action, verification, output),
          duration: Date.now() - startTime,
        }

        console.log(`[Skill:${name}] Completed (${ospResult.verification.status})`)

        return JSON.stringify(ospResult)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        const verification = verify(action.expectedEffects, { 'Skill completed successfully': false })

        const ospResult: OspResult = {
          ...createResult(context, action, verification),
          duration: Date.now() - startTime,
        }

        console.error(`[Skill:${name}] Error (${ospResult.verification.status}):`, errorMessage)

        return JSON.stringify(ospResult)
      }
    },
  })
}
