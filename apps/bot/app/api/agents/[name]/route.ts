import { NextResponse } from 'next/server'
import { requireBypass } from '@/lib/bypass'
import { agents } from '@/lib/registry'

export const revalidate = 3600
export const dynamicParams = false

export async function generateStaticParams() {
  const list = await agents.list()
  return list.map(a => ({ name: a.name }))
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  const denied = requireBypass(request)
  if (denied) return denied

  const { name } = await params

  const agent = await agents.get(name)
  if (!agent) {
    return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
  }
  return NextResponse.json(agent)
}
