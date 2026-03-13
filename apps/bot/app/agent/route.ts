import { resolve } from 'path'
import { type SkillManifestV2 } from '@syner/osprotocol'
import { getPublicSkills } from 'syner/skills'

export async function GET() {
  const projectRoot = resolve(process.cwd(), '../..')
  const publicSkills = await getPublicSkills(projectRoot)

  const summaries: SkillManifestV2[] = publicSkills
    .filter((s) => s.manifest)
    .map((s) => s.manifest as SkillManifestV2)

  return Response.json(summaries)
}
