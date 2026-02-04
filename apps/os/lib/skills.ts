/**
 * Skills Integration
 *
 * Integrates the SDK's skill discovery and loading with Vercel sandbox tools.
 * Provides a unified interface for initializing all available tools.
 */

import type { Tool } from 'ai'
import {
  discoverSkillsAuto,
  loadSkills,
  getToolsFromSkills,
  type LoadedSkill,
} from '@syner/sdk'
import { createSandbox, writeFiles, readFile } from '@syner/vercel'

/**
 * Context containing loaded skills and their tools
 */
export interface SkillContext {
  /** All loaded tools ready for AI SDK */
  tools: Record<string, Tool>
  /** Human-readable descriptions of available skills */
  descriptions: string
  /** Loaded skill definitions (for introspection) */
  loadedSkills: LoadedSkill[]
}

/**
 * Default sandbox tools from @syner/vercel
 */
function getSandboxTools(): Record<string, Tool> {
  return {
    createSandbox: createSandbox({
      runtime: 'node22',
      timeout: 300000,
    }),
    writeFiles: writeFiles(),
    readFile: readFile(),
  }
}

/**
 * Generate human-readable skill descriptions for the system prompt
 */
function generateSkillDescriptions(skills: LoadedSkill[], sandboxTools: boolean): string {
  const descriptions: string[] = []

  // Add SDK skill descriptions
  for (const skill of skills) {
    const toolNames = Object.keys(skill.tools)
    if (toolNames.length > 0) {
      descriptions.push(
        `- ${skill.definition.metadata.name}: ${skill.definition.metadata.description} (${toolNames.join(', ')})`
      )
    }
  }

  // Add sandbox tools
  if (sandboxTools) {
    descriptions.push(
      '- sandbox: Vercel sandbox for code execution (createSandbox, writeFiles, readFile)'
    )
  }

  return descriptions.join('\n')
}

/**
 * Initialize all available skills and tools
 *
 * This function:
 * 1. Uses discoverSkillsAuto() to find SKILL.md files
 * 2. Loads tools from each skill via loadSkills()
 * 3. Merges with Vercel sandbox tools
 * 4. Generates skill descriptions for system prompt
 */
export async function initializeSkills(): Promise<SkillContext> {
  // Discover skills from SDK
  const registry = await discoverSkillsAuto()

  // Load all discovered skills
  const loadedSkills = await loadSkills(registry)

  // Get tools from SDK skills (prefixed by skill name)
  const sdkTools = getToolsFromSkills(loadedSkills)

  // Get sandbox tools from Vercel
  const sandboxTools = getSandboxTools()

  // Merge all tools
  const tools: Record<string, Tool> = {
    ...sdkTools,
    ...sandboxTools,
  }

  // Generate descriptions
  const descriptions = generateSkillDescriptions(loadedSkills, true)

  return {
    tools,
    descriptions,
    loadedSkills,
  }
}

/**
 * Get skill by name from loaded skills
 */
export function getSkillByName(
  context: SkillContext,
  name: string
): LoadedSkill | undefined {
  return context.loadedSkills.find(
    (skill) => skill.definition.metadata.name === name
  )
}

/**
 * Get tools for a specific skill
 */
export function getToolsForSkill(
  context: SkillContext,
  skillName: string
): Record<string, Tool> {
  const prefix = `${skillName}_`
  const result: Record<string, Tool> = {}

  for (const [name, tool] of Object.entries(context.tools)) {
    if (name.startsWith(prefix)) {
      result[name.slice(prefix.length)] = tool
    }
  }

  return result
}
