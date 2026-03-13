import { readFileSync } from 'fs'
import { resolve } from 'path'
import { parseSkillManifest, type ParseResult } from '@syner/osprotocol'

let cachedManifest: ParseResult | null = null

function getManifest(): ParseResult {
  if (cachedManifest) return cachedManifest
  const content = readFileSync(resolve(process.cwd(), 'SKILL.md'), 'utf-8')
  cachedManifest = parseSkillManifest(content)
  return cachedManifest
}

export async function GET() {
  const manifest = getManifest()
  return Response.json(manifest)
}
