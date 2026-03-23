import { NextResponse } from 'next/server'
import { requireBypass } from '@/lib/bypass'
import { skills } from '@/lib/registry'

export const revalidate = 3600
export const dynamicParams = false

export async function generateStaticParams() {
  const list = await skills.list()
  return list.map(s => ({ slug: (s.metadata?.slug as string) || s.name }))
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const denied = requireBypass(request)
  if (denied) return denied

  const { slug } = await params

  const skill = await skills.read(slug)
  if (!skill) {
    return NextResponse.json({ error: 'Skill not found' }, { status: 404 })
  }
  return NextResponse.json(skill)
}
