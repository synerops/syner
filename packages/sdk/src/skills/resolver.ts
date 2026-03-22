import { skills } from './loader'
import type { SkillEntry } from './types'

export interface ResolvedSkill {
  slug: string
  skill: SkillEntry
  confidence: number // 0-1
  reason: string
}

const CONFIDENCE_THRESHOLD = 0.3

/**
 * Tokenize a string into lowercase words, splitting on whitespace,
 * hyphens, underscores, and slashes.
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[\s\-_\/]+/)
    .filter((w) => w.length > 1)
}

/**
 * Compute keyword overlap score between intent tokens and skill tokens.
 * Returns a value between 0 and 1.
 */
function computeOverlap(intentTokens: string[], skillTokens: string[]): number {
  if (intentTokens.length === 0 || skillTokens.length === 0) {
    return 0
  }

  const skillSet = new Set(skillTokens)
  let matches = 0

  for (const token of intentTokens) {
    if (skillSet.has(token)) {
      matches++
    } else {
      // Partial match: check if any skill token contains the intent token or vice versa
      for (const skillToken of skillSet) {
        if (skillToken.includes(token) || token.includes(skillToken)) {
          matches += 0.5
          break
        }
      }
    }
  }

  // Normalize by intent length to get recall-like score
  return matches / intentTokens.length
}

/**
 * Build searchable tokens for a skill from its name and description.
 */
function getSkillTokens(skill: SkillEntry): string[] {
  const parts = [skill.slug, skill.name, skill.description].filter(Boolean)
  return tokenize(parts.join(' '))
}

/**
 * Resolve an intent string to the best matching skill.
 *
 * Strategy:
 * 1. Exact match: if intent starts with `/`, strip prefix and match slug directly (confidence 1.0)
 * 2. Fuzzy match: tokenize intent, score each skill by keyword overlap
 * 3. Return best match above threshold (0.3), or null
 */
export async function resolveSkill(intent: string): Promise<ResolvedSkill | null> {
  const entries = await skills.entries()
  const trimmed = intent.trim()

  // 1. Exact match: intent starts with `/`
  if (trimmed.startsWith('/')) {
    const slug = trimmed.slice(1).split(/\s/)[0].toLowerCase()
    const entry = entries.get(slug)
    if (entry) {
      return {
        slug: entry.slug,
        skill: entry,
        confidence: 1.0,
        reason: `Exact match: intent starts with /${slug}`,
      }
    }
  }

  // 2. Fuzzy match: tokenize and score
  const intentTokens = tokenize(trimmed)
  if (intentTokens.length === 0) {
    return null
  }

  let bestMatch: ResolvedSkill | null = null
  let bestScore = 0

  for (const [, entry] of entries) {
    const skillTokens = getSkillTokens(entry)
    const score = computeOverlap(intentTokens, skillTokens)

    if (score > bestScore) {
      bestScore = score
      bestMatch = {
        slug: entry.slug,
        skill: entry,
        confidence: Math.min(score, 1.0),
        reason: buildReason(intentTokens, skillTokens, entry),
      }
    }
  }

  // 3. Apply threshold
  if (bestMatch && bestMatch.confidence >= CONFIDENCE_THRESHOLD) {
    return bestMatch
  }

  return null
}

/**
 * Build a human-readable reason for why a skill matched.
 */
function buildReason(intentTokens: string[], skillTokens: string[], skill: SkillEntry): string {
  const skillSet = new Set(skillTokens)
  const matched: string[] = []

  for (const token of intentTokens) {
    if (skillSet.has(token)) {
      matched.push(token)
    } else {
      for (const skillToken of skillSet) {
        if (skillToken.includes(token) || token.includes(skillToken)) {
          matched.push(`${token}~${skillToken}`)
          break
        }
      }
    }
  }

  return `Fuzzy match on "${skill.name}": overlapping tokens [${matched.join(', ')}]`
}
