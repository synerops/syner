import { NextResponse } from 'next/server'
import { skills } from '@/lib/registry'

export const dynamic = 'force-static'
export const dynamicParams = false

export async function generateStaticParams() {
  const list = await skills.list()
  return list.map(s => ({ slug: (s.metadata?.slug as string) || s.name }))
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params

  const skill = await skills.read(slug)
  if (!skill) {
    return NextResponse.json({ error: 'Skill not found' }, { status: 404 })
  }
  return NextResponse.json(skill)
}
