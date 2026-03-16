import { readFileSync } from 'fs'
import { resolve } from 'path'
import { parseSkillManifest, type Skill } from '@syner/osprotocol'
import { getPublicSkills, getInstanceSkills } from '@syner/sdk/skills'

export type InstanceScope = 'external' | 'internal'

export interface InstanceCard {
  name: string
  description: string
  url: string
  version: string
  capabilities: {
    streaming: boolean
    pushNotifications: boolean
  }
  skills: Array<{
    id: string
    name: string
    description: string
  }>
}

let cachedManifest: Skill | null = null

function getManifest(): Skill {
  if (cachedManifest) return cachedManifest
  const content = readFileSync(resolve(process.cwd(), 'SKILL.md'), 'utf-8')
  const result = parseSkillManifest(content)
  cachedManifest = result.skill
  return cachedManifest
}

/**
 * Determine request scope from the x-syner-internal header.
 * Internal requests must provide the shared instance secret.
 */
export function getRequestScope(request: Request): InstanceScope {
  const secret = process.env.SYNER_INSTANCE_SECRET
  if (!secret) return 'external'
  const header = request.headers.get('x-syner-internal')
  return header === secret ? 'internal' : 'external'
}

export async function getInstanceCard(scope: InstanceScope = 'external'): Promise<InstanceCard> {
  const manifest = getManifest()

  const projectRoot = resolve(process.cwd(), '../..')
  const skills = scope === 'internal'
    ? await getInstanceSkills(projectRoot)
    : await getPublicSkills(projectRoot)

  return {
    name: manifest.name || 'syner',
    description: manifest.description || '',
    url: process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : 'http://localhost:3001',
    version: manifest.metadata?.version || '0.1.0',
    capabilities: {
      streaming: false,
      pushNotifications: false,
    },
    skills: skills.map((s) => ({
      id: s.name,
      name: s.name,
      description: s.description,
    })),
  }
}
