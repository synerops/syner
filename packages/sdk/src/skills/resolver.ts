import { skills } from './loader'
import type { Skill } from 'syner/skills'

export interface ResolvedSkill {
  slug: string
  skill: Skill
  confidence: number // 0-1
  reason: string
}

const CONFIDENCE_THRESHOLD = 0.3

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[\s\-_\/]+/)
    .filter((w) => w.length > 1)
}

function computeOverlap(intentTokens: string[], skillTokens: string[]): number {
  if (intentTokens.length === 0 || skillTokens.length === 0) return 0
  const skillSet = new Set(skillTokens)
  let matches = 0
  for (const token of intentTokens) {
    if (skillSet.has(token)) {
      matches++
    } else {
      for (const skillToken of skillSet) {
        if (skillToken.includes(token) || token.includes(skillToken)) {
          matches += 0.5
          break
        }
      }
    }
  }
  return matches / intentTokens.length
}

function getSkillTokens(skill: Skill): string[] {
  const slug = (skill.metadata?.slug as string) || skill.name
  const parts = [slug, skill.name, skill.description].filter(Boolean)
  return tokenize(parts.join(' '))
}

export async function resolveSkill(intent: string): Promise<ResolvedSkill | null> {
  const entries = await skills.entries()
  const trimmed = intent.trim()

  if (trimmed.startsWith('/')) {
    const slug = trimmed.slice(1).split(/\s/)[0].toLowerCase()
    const entry = entries.get(slug)
    if (entry) {
      return {
        slug: (entry.metadata?.slug as string) || entry.name,
        skill: entry,
        confidence: 1.0,
        reason: `Exact match: intent starts with /${slug}`,
      }
    }
  }

  const intentTokens = tokenize(trimmed)
  if (intentTokens.length === 0) return null

  let bestMatch: ResolvedSkill | null = null
  let bestScore = 0

  for (const [, entry] of entries) {
    const skillTokens = getSkillTokens(entry)
    const score = computeOverlap(intentTokens, skillTokens)

    if (score > bestScore) {
      bestScore = score
      bestMatch = {
        slug: (entry.metadata?.slug as string) || entry.name,
        skill: entry,
        confidence: Math.min(score, 1.0),
        reason: `Fuzzy match on "${entry.name}": overlapping tokens [${intentTokens.filter(t => skillTokens.some(st => st.includes(t) || t.includes(st))).join(', ')}]`,
      }
    }
  }

  if (bestMatch && bestMatch.confidence >= CONFIDENCE_THRESHOLD) return bestMatch
  return null
}
