/**
 * Skill Discovery
 *
 * Finds SKILL.md files in the filesystem and registers them for loading.
 * Respects project scope security boundaries.
 */

import { readdir, stat } from 'node:fs/promises'
import { join, dirname, resolve } from 'node:path'
import type { SkillRegistryEntry, ProtocolDomain, RuntimeConfig } from '../types'
import { parseSkillFile } from './parser'
import { findProjectRoot } from '../config'
import { assertWithinScope } from '../security'

const SKILL_FILENAME = 'SKILL.md'

/**
 * Recursively discover all SKILL.md files in a directory
 * Respects project scope boundaries when projectRoot is provided
 */
async function findSkillFiles(basePath: string, projectRoot?: string): Promise<string[]> {
  const skillFiles: string[] = []

  async function walk(dir: string): Promise<void> {
    // Validate we're still within project scope
    if (projectRoot) {
      try {
        assertWithinScope(dir, projectRoot)
      } catch {
        // Skip directories outside project scope
        return
      }
    }

    let entries
    try {
      entries = await readdir(dir, { withFileTypes: true })
    } catch {
      // Directory doesn't exist or not readable
      return
    }

    for (const entry of entries) {
      const fullPath = join(dir, entry.name)

      if (entry.isDirectory()) {
        // Skip node_modules and hidden directories
        if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
          await walk(fullPath)
        }
      } else if (entry.name === SKILL_FILENAME) {
        skillFiles.push(fullPath)
      }
    }
  }

  await walk(basePath)
  return skillFiles
}

/**
 * Discover all skills within the project
 */
export async function discoverSkills(config: RuntimeConfig): Promise<SkillRegistryEntry[]> {
  const registry: SkillRegistryEntry[] = []
  const projectRoot = config.projectRoot
  const searchPaths = [config.basePath, ...(config.extensions ?? [])]

  for (const searchPath of searchPaths) {
    try {
      const resolvedPath = resolve(searchPath)

      // Validate path is within project scope if projectRoot is set
      if (projectRoot) {
        try {
          assertWithinScope(resolvedPath, projectRoot)
        } catch {
          console.warn(`[discovery] Skipping path outside project scope: ${searchPath}`)
          continue
        }
      }

      const pathStat = await stat(resolvedPath)
      if (!pathStat.isDirectory()) continue

      const skillFiles = await findSkillFiles(resolvedPath, projectRoot)

      for (const skillPath of skillFiles) {
        try {
          const definition = await parseSkillFile(skillPath)
          registry.push({
            name: definition.metadata.name,
            domain: definition.metadata.protocol.domain,
            api: definition.metadata.protocol.api,
            path: dirname(skillPath),
            loaded: false,
          })
        } catch {
          console.warn(`[discovery] Invalid skill file: ${skillPath}`)
        }
      }
    } catch {
      // Path doesn't exist, skip
    }
  }

  return registry
}

/**
 * Discover skills by domain
 */
export async function discoverSkillsByDomain(
  config: RuntimeConfig,
  domain: ProtocolDomain
): Promise<SkillRegistryEntry[]> {
  const all = await discoverSkills(config)
  return all.filter((entry) => entry.domain === domain)
}

/**
 * Discover skills with automatic project root detection
 * This is the recommended way to discover skills
 */
export async function discoverSkillsAuto(basePath?: string): Promise<SkillRegistryEntry[]> {
  const projectRoot = await findProjectRoot()
  const searchPath = basePath ?? projectRoot

  return discoverSkills({
    basePath: searchPath,
    projectRoot,
  })
}
