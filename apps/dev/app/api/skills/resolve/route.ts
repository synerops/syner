import { NextResponse } from 'next/server'
import { getSkillsList } from '@syner/sdk/skills'
import path from 'path'

// Dynamic — POST handler requires runtime execution
export const dynamic = 'force-dynamic'

// Project root is two levels up from apps/dev
function getProjectRoot(): string {
  return path.resolve(process.cwd(), '../..')
}

function scoreMatch(intent: string, description: string): number {
  const intentTokens = new Set(intent.toLowerCase().split(/\s+/))
  const descTokens = description.toLowerCase().split(/\s+/)
  const overlap = descTokens.filter((t) => intentTokens.has(t)).length
  return overlap / Math.max(intentTokens.size, 1)
}

export async function POST(request: Request) {
  const { intent } = await request.json()

  if (!intent || typeof intent !== 'string') {
    return NextResponse.json(
      { error: 'Missing or invalid "intent" field' },
      { status: 400 }
    )
  }

  const projectRoot = getProjectRoot()
  const skills = await getSkillsList(projectRoot)

  const matches = skills
    .map((skill) => ({
      name: skill.name,
      description: skill.description,
      score: scoreMatch(intent, skill.description),
    }))
    .filter((m) => m.score > 0.3)
    .sort((a, b) => b.score - a.score)

  return NextResponse.json({
    skill: matches[0]?.name ?? null,
    confidence: matches[0]?.score ?? 0,
    alternatives: matches.slice(1, 3),
  })
}

export async function GET() {
  const projectRoot = getProjectRoot()
  const skills = await getSkillsList(projectRoot)

  return NextResponse.json(
    skills.map((s) => ({
      name: s.name,
      description: s.description,
    }))
  )
}
