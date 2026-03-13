import { readFileSync } from 'fs'
import { resolve } from 'path'
import { parseSkillManifest, type SkillManifestV2 } from '@syner/osprotocol'
import { createAgentHandler } from '@syner/vercel'

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

export const POST = createAgentHandler({
  agentId: '{{name}}',
  skillRef: '{{name}}',
  manifest: getManifest(),
  handler: async (req) => {
    const body = await req.json()
    return { status: 'ok', input: body }
  },
})
