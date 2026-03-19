import { readFile } from 'fs/promises'
import { existsSync } from 'fs'
import { SkillsMap, type SkillIndex } from './index'

const VALID_SKILL_NAME = /^[a-z0-9-]+$/

// In-memory content cache — survives across requests within same process
// TODO: Replace with Redis/Vercel KV for cross-instance caching
const contentCache = new Map<string, string>()

/**
 * Load skills index from .well-known JSON and return a populated SkillsMap.
 *
 * Progressive disclosure step 1: metadata at startup (~5KB).
 */
export async function loadSkills(indexPath: string): Promise<SkillsMap> {
  if (!existsSync(indexPath)) {
    return new SkillsMap()
  }
  const raw = await readFile(indexPath, 'utf-8')
  const index: SkillIndex = JSON.parse(raw)
  return new SkillsMap(index.skills.map(s => [s.name, s]))
}

/**
 * Load pre-rendered skill content from .well-known static file.
 *
 * Progressive disclosure step 2: full content on activation (~2-5KB).
 * Uses in-memory cache — first read hits disk, subsequent reads are free.
 *
 * Security: validates name against /^[a-z0-9-]+$/ before constructing path.
 */
export async function loadSkillContent(skillsDir: string, name: string): Promise<string | null> {
  // Defense in depth — prevent path traversal even if caller forgot has() check
  if (!VALID_SKILL_NAME.test(name)) return null

  const cached = contentCache.get(name)
  if (cached) return cached

  const filePath = `${skillsDir}/${name}.json`
  if (!existsSync(filePath)) return null

  try {
    const raw = await readFile(filePath, 'utf-8')
    const { content } = JSON.parse(raw) as { content: string }
    contentCache.set(name, content)
    return content
  } catch {
    return null
  }
}
