import { readFileSync } from 'fs'
import { resolve } from 'path'
import { parseSkillManifest, type SkillManifestV2 } from '@syner/osprotocol'

let cachedManifest: SkillManifestV2 | null = null

function getManifest(): SkillManifestV2 {
  if (cachedManifest) return cachedManifest
  const content = readFileSync(resolve(process.cwd(), 'SKILL.md'), 'utf-8')
  cachedManifest = parseSkillManifest(content)
  return cachedManifest
}

export async function GET() {
  const manifest = getManifest()
  return Response.json(manifest)
}
