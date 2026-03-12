import { readFileSync } from 'fs'
import { resolve } from 'path'
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
    .map((s) => s.manifest as SkillManifestV2)

  return Response.json({ ...manifest, skills: publicSkills })
}
