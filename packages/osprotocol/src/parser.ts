import matter from 'gray-matter'
import type { SkillManifest, InputField, OutputField } from './types/skill-manifest'

function parseListSection(body: string, heading: string): string[] | undefined {
  const regex = new RegExp(`^##\\s+${heading}\\s*$`, 'im')
  const match = body.search(regex)
  if (match === -1) return undefined

  const afterHeading = body.slice(match)
  const lines = afterHeading.split('\n').slice(1)
  const items: string[] = []

  for (const line of lines) {
    if (/^##\s/.test(line)) break
    const listMatch = line.match(/^[-*]\s+(.+)/)
    if (listMatch) items.push(listMatch[1].trim())
  }

  return items.length > 0 ? items : undefined
}

function parseInputs(body: string): InputField[] | undefined {
  const items = parseListSection(body, 'Inputs')
  if (!items) return undefined

  return items.map((item) => {
    const match = item.match(/^(\w+)\s*\(([^)]+)\)(?:\s*[-—]\s*(.+))?/)
    if (match) {
      const required = match[2].includes('required')
      const type = match[2].replace(/,?\s*required/, '').trim() || 'string'
      return {
        name: match[1],
        type,
        required: required || undefined,
        description: match[3]?.trim(),
      }
    }
    // Simple format: just a name
    return { name: item, type: 'string' }
  })
}

function parseOutputs(body: string): OutputField[] | undefined {
  const items = parseListSection(body, 'Outputs')
  if (!items) return undefined

  return items.map((item) => {
    const match = item.match(/^(\w+)\s*\(([^)]+)\)(?:\s*[-—]\s*(.+))?/)
    if (match) {
      return {
        name: match[1],
        type: match[2].trim(),
        description: match[3]?.trim(),
      }
    }
    return { name: item, type: 'string' }
  })
}

export function parseSkillManifest(content: string): SkillManifest {
  const { data, content: body } = matter(content)

  const manifest: SkillManifest = {
    ...data,
  }

  // Parse structured sections from markdown body
  const preconditions = parseListSection(body, 'Preconditions')
  if (preconditions) manifest.preconditions = preconditions

  const effects = parseListSection(body, 'Effects')
  if (effects) manifest.effects = effects

  const verification = parseListSection(body, 'Verification')
  if (verification) manifest.verification = verification

  const notFor = parseListSection(body, 'I am NOT')
  if (notFor) manifest.notFor = notFor

  const inputs = parseInputs(body)
  if (inputs) manifest.inputs = inputs

  const outputs = parseOutputs(body)
  if (outputs) manifest.outputs = outputs

  return manifest
}
