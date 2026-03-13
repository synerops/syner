import { readFileSync } from 'fs'
import { resolve } from 'path'
import { parseSkillManifest, type SkillManifestV2 } from '@syner/osprotocol'
import { getPublicSkills, getInstanceSkills } from 'syner/skills'
import type { NextRequest } from 'next/server'

const INTERNAL_TOKEN = process.env.SYNER_INTERNAL_TOKEN

let cachedManifest: SkillManifestV2 | null = null

function getManifest(): SkillManifestV2 {
  if (cachedManifest) return cachedManifest
  const content = readFileSync(resolve(process.cwd(), 'SKILL.md'), 'utf-8')
  cachedManifest = parseSkillManifest(content)
  return cachedManifest
}

function isInternalRequest(request: NextRequest): boolean {
  if (!INTERNAL_TOKEN) return false
  const auth = request.headers.get('authorization')
  return auth === `Bearer ${INTERNAL_TOKEN}`
}

export async function GET(request: NextRequest) {
  const manifest = getManifest()
  const projectRoot = resolve(process.cwd(), '../..')

  const skills = isInternalRequest(request)
    ? await getInstanceSkills(projectRoot)
    : await getPublicSkills(projectRoot)

  const skillManifests = skills
    .map((s) => s.manifest)
    .filter((m): m is SkillManifestV2 => m != null)

  return Response.json({ ...manifest, skills: skillManifests })
}
