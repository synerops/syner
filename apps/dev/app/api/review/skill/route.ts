import { NextResponse } from 'next/server'
import { parseSkillManifest } from '@syner/osprotocol'

interface ReviewIssue {
  severity: 'error' | 'warning' | 'info'
  message: string
  line: number
}

export async function POST(request: Request) {
  let body: { skillPath?: string; content?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid JSON body' }, { status: 400 })
  }

  const { skillPath, content } = body

  if (!content || typeof content !== 'string') {
    return NextResponse.json(
      { error: 'Missing or invalid "content" field' },
      { status: 400 }
    )
  }

  const issues: ReviewIssue[] = []

  // 1. Parse and validate frontmatter
  let parsed: ReturnType<typeof parseSkillManifest> | null = null
  try {
    parsed = parseSkillManifest(content)
    for (const warning of parsed.warnings) {
      issues.push({ severity: 'warning', message: warning, line: 0 })
    }
  } catch (err) {
    issues.push({
      severity: 'error',
      message: `Parse error: ${err instanceof Error ? err.message : String(err)}`,
      line: 0,
    })
  }

  // 2. Agent Skills spec compliance
  if (parsed) {
    const m = parsed.skill
    if (!m.name) {
      issues.push({ severity: 'error', message: 'Missing required field: name', line: 0 })
    }
    if (!m.description) {
      issues.push({ severity: 'error', message: 'Missing required field: description', line: 0 })
    }
    if (m.name && !/^[a-z][a-z0-9-]*$/.test(m.name)) {
      issues.push({
        severity: 'warning',
        message: 'name should be lowercase with hyphens per Agent Skills spec',
        line: 0,
      })
    }
    if (m.description && m.description.length > 1024) {
      issues.push({
        severity: 'warning',
        message: 'description exceeds 1024 chars (Agent Skills spec limit)',
        line: 0,
      })
    }
  }

  // 3. Voice check — no first-person
  const lines = content.split('\n')
  lines.forEach((line: string, i: number) => {
    if (/\bI will\b|\bI am\b|\bWhat I Do\b/i.test(line)) {
      issues.push({
        severity: 'warning',
        message: 'First-person voice detected — use imperative',
        line: i + 1,
      })
    }
  })

  return NextResponse.json({
    skillPath: skillPath ?? null,
    issues,
    pass: issues.filter((i) => i.severity === 'error').length === 0,
  })
}
