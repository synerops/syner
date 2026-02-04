/**
 * Skill Loader
 *
 * Dynamically loads skill tools from the filesystem.
 */

import { join } from 'node:path'
import { readdir, stat } from 'node:fs/promises'
import type { Tool } from 'ai'
import type { SkillDefinition, LoadedSkill, SkillRegistryEntry } from '../types'
import { parseSkillFile } from './parser'

const TOOLS_DIR = 'tools'

/**
 * Load tools from a skill's tools directory
 */
async function loadToolsFromDirectory(toolsPath: string): Promise<Record<string, Tool>> {
  const tools: Record<string, Tool> = {}

  try {
    const pathStat = await stat(toolsPath)
    if (!pathStat.isDirectory()) return tools

    const entries = await readdir(toolsPath, { withFileTypes: true })

    for (const entry of entries) {
      if (!entry.isFile()) continue
      if (!entry.name.endsWith('.ts') && !entry.name.endsWith('.js')) continue
      if (entry.name === 'index.ts' || entry.name === 'index.js') continue

      const toolPath = join(toolsPath, entry.name)
      const toolName = entry.name.replace(/\.(ts|js)$/, '')

      try {
        const module = await import(toolPath)
        // Tool can be default export or named export matching filename
        const tool = module.default ?? module[toolName]
        if (tool) {
          tools[toolName] = tool
        }
      } catch {
        console.warn(`[loader] Failed to load tool: ${toolPath}`)
      }
    }
  } catch {
    // No tools directory
  }

  return tools
}

/**
 * Load a single skill from its directory path
 */
export async function loadSkill(skillPath: string): Promise<LoadedSkill> {
  const skillFile = join(skillPath, 'SKILL.md')
  const definition = await parseSkillFile(skillFile)
  const toolsPath = join(skillPath, TOOLS_DIR)
  const tools = await loadToolsFromDirectory(toolsPath)

  return {
    definition,
    tools,
  }
}

/**
 * Load a skill from a registry entry
 */
export async function loadSkillFromRegistry(entry: SkillRegistryEntry): Promise<LoadedSkill> {
  return loadSkill(entry.path)
}

/**
 * Load multiple skills from registry entries
 */
export async function loadSkills(entries: SkillRegistryEntry[]): Promise<LoadedSkill[]> {
  const results: LoadedSkill[] = []

  for (const entry of entries) {
    try {
      const skill = await loadSkillFromRegistry(entry)
      results.push(skill)
    } catch {
      console.warn(`[loader] Failed to load skill: ${entry.name}`)
    }
  }

  return results
}

/**
 * Get all tools from loaded skills as a flat record
 */
export function getToolsFromSkills(skills: LoadedSkill[]): Record<string, Tool> {
  const tools: Record<string, Tool> = {}

  for (const skill of skills) {
    const prefix = skill.definition.metadata.name
    for (const [name, tool] of Object.entries(skill.tools)) {
      tools[`${prefix}_${name}`] = tool
    }
  }

  return tools
}

/**
 * Get all tools from loaded skills grouped by skill name
 */
export function getToolsBySkill(skills: LoadedSkill[]): Record<string, Record<string, Tool>> {
  const result: Record<string, Record<string, Tool>> = {}

  for (const skill of skills) {
    result[skill.definition.metadata.name] = skill.tools
  }

  return result
}
