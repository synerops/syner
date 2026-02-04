/**
 * Skill Loader
 *
 * Dynamically loads skill tools from the filesystem.
 * Validates paths against project scope before loading.
 */

import { join, resolve } from 'node:path'
import { readdir, stat } from 'node:fs/promises'
import type { Tool } from 'ai'
import type { LoadedSkill, SkillRegistryEntry } from '../types'
import { parseSkillFile } from './parser'
import { validateImportPath, resolveSafePath, SecurityError } from '../security'

const TOOLS_DIR = 'tools'

/**
 * Options for loading tools
 */
export interface LoadToolsOptions {
  /** Project root for security validation */
  projectRoot?: string
  /** Allowed paths for tool loading */
  allowedPaths?: string[]
}

/**
 * Load tools from a skill's tools directory
 * Validates paths before dynamic imports when projectRoot is provided
 */
async function loadToolsFromDirectory(
  toolsPath: string,
  options: LoadToolsOptions = {}
): Promise<Record<string, Tool>> {
  const tools: Record<string, Tool> = {}
  const { projectRoot } = options

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
        // Validate path security before import
        if (projectRoot) {
          validateImportPath(toolPath, projectRoot)
        }

        const module = await import(toolPath)
        // Tool can be default export or named export matching filename
        const tool = module.default ?? module[toolName]
        if (tool) {
          tools[toolName] = tool
        }
      } catch (error) {
        if (error instanceof SecurityError) {
          console.error(`[loader] Security violation loading tool: ${toolPath}`, error.message)
          throw error
        }
        console.warn(`[loader] Failed to load tool: ${toolPath}`)
      }
    }
  } catch (error) {
    if (error instanceof SecurityError) {
      throw error
    }
    // No tools directory
  }

  return tools
}

/**
 * Load a single skill from its directory path
 */
export async function loadSkill(skillPath: string, options: LoadToolsOptions = {}): Promise<LoadedSkill> {
  const { projectRoot } = options

  // Validate skill path is within project scope
  if (projectRoot) {
    const resolvedPath = resolveSafePath(skillPath, projectRoot)
    skillPath = resolvedPath
  }

  const skillFile = join(skillPath, 'SKILL.md')
  const definition = await parseSkillFile(skillFile)
  const toolsPath = join(skillPath, TOOLS_DIR)
  const tools = await loadToolsFromDirectory(toolsPath, options)

  return {
    definition,
    tools,
  }
}

/**
 * Load a skill from a registry entry
 */
export async function loadSkillFromRegistry(
  entry: SkillRegistryEntry,
  options: LoadToolsOptions = {}
): Promise<LoadedSkill> {
  return loadSkill(entry.path, options)
}

/**
 * Load multiple skills from registry entries
 */
export async function loadSkills(
  entries: SkillRegistryEntry[],
  options: LoadToolsOptions = {}
): Promise<LoadedSkill[]> {
  const results: LoadedSkill[] = []

  for (const entry of entries) {
    try {
      const skill = await loadSkillFromRegistry(entry, options)
      results.push(skill)
    } catch (error) {
      if (error instanceof SecurityError) {
        console.error(`[loader] Security violation for skill: ${entry.name}`, error.message)
        // Don't include skills that fail security validation
        continue
      }
      console.warn(`[loader] Failed to load skill: ${entry.name}`)
    }
  }

  return results
}

/**
 * Load skills with project root from runtime config
 */
export async function loadSkillsSecure(
  entries: SkillRegistryEntry[],
  projectRoot: string
): Promise<LoadedSkill[]> {
  return loadSkills(entries, { projectRoot })
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
