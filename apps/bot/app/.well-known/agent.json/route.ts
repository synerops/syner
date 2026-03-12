import { resolve } from 'path'
import { readFileSync } from 'fs'
import { parseSkillManifest, type SkillManifestV2 } from '@syner/osprotocol'
import { getSkillsList } from 'syner/skills'

let cachedManifest: SkillManifestV2 | null = null

function getManifest(): SkillManifestV2 {
  if (cachedManifest) return cachedManifest
  const content = readFileSync(resolve(process.cwd(), 'SKILL.md'), 'utf-8')
  cachedManifest = parseSkillManifest(content)
  return cachedManifest
}

export async function GET() {
  const manifest = getManifest()

  const projectRoot = resolve(process.cwd(), '../..')
  const allSkills = await getSkillsList(projectRoot)
  const publicSkills = allSkills
    .filter((s) => s.manifest?.visibility === 'public')
    .map((s) => ({
      id: s.slug,
      name: s.manifest!.name || s.slug,
      description: s.manifest!.description || '',
    }))

  return Response.json({
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
    skills: publicSkills,
  })
}
