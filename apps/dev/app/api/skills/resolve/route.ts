import { NextResponse } from 'next/server'
import { skills } from '@syner/sdk/skills'

// Dynamic — POST handler requires runtime execution
export const dynamic = 'force-dynamic'

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

  const list = await skills.list()

  const matches = list
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
  const list = await skills.list()

  return NextResponse.json(
    list.map((s) => ({
      name: s.name,
      description: s.description,
    }))
  )
}
