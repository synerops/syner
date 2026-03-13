import type { Friction } from './friction.js'
import type { Category } from './types/changes.js'

export interface Pattern {
  skillRef: string
  pattern: string
  frequency: number
  severity: 'low' | 'medium' | 'high'
  suggestedCategory: Category
}

/** @deprecated Use Pattern instead */
export type FrictionPattern = Pattern

interface AnalyzerOptions {
  minFrequency?: number
  windowDays?: number
}

export function analyzeFriction(
  events: Friction[],
  options: AnalyzerOptions = {}
): Pattern[] {
  const { minFrequency = 3, windowDays = 30 } = options
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - windowDays)
  const cutoffISO = cutoff.toISOString()

  // Group by skillRef + failureType
  const groups = new Map<string, Friction[]>()
  for (const event of events) {
    if (event.lastSeen < cutoffISO) continue
    const key = `${event.skillRef}::${event.failureType}`
    const group = groups.get(key) ?? []
    group.push(event)
    groups.set(key, group)
  }

  const patterns: Pattern[] = []

  for (const [, group] of groups) {
    const totalFrequency = group.reduce((sum, e) => sum + e.frequency, 0)
    if (totalFrequency < minFrequency) continue

    const representative = group[0]
    patterns.push({
      skillRef: representative.skillRef,
      pattern: representative.failureType,
      frequency: totalFrequency,
      severity: getSeverity(totalFrequency),
      suggestedCategory: getSuggestedCategory(totalFrequency),
    })
  }

  return patterns.sort((a, b) => b.frequency - a.frequency)
}

function getSeverity(frequency: number): Pattern['severity'] {
  if (frequency >= 10) return 'high'
  if (frequency >= 5) return 'medium'
  return 'low'
}

function getSuggestedCategory(frequency: number): Category {
  if (frequency >= 10) return 'structural'
  if (frequency >= 5) return 'new-skill'
  return 'skill-tweak'
}
