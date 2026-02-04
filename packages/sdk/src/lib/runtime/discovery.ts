/**
 * Skill Discovery
 *
 * Finds SKILL.md files in the filesystem and registers them for loading.
 */

import { readdir, stat } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import type { SkillRegistryEntry, ProtocolDomain, RuntimeConfig } from '../types'
import { parseSkillFile } from './parser'

const SKILL_FILENAME = 'SKILL.md'

/**
 * Recursively discover all SKILL.md files in a directory
 */
async function findSkillFiles(basePath: string): Promise<string[]> {
  const skillFiles: string[] = []

  async function walk(dir: string): Promise<void> {
    const entries = await readdir(dir, { withFileTypes: true })

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
 * Discover all skills in the SDK and extensions
 */
export async function discoverSkills(config: RuntimeConfig): Promise<SkillRegistryEntry[]> {
  const registry: SkillRegistryEntry[] = []
  const searchPaths = [config.basePath, ...(config.extensions ?? [])]

  for (const searchPath of searchPaths) {
    try {
      const pathStat = await stat(searchPath)
      if (!pathStat.isDirectory()) continue

      const skillFiles = await findSkillFiles(searchPath)

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
          // Skip invalid skill files
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
