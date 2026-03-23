import { NextResponse } from 'next/server'
import { requireBypass } from '@/lib/bypass'
import { agents } from '@/lib/registry'

export const dynamic = 'force-static'

export async function GET(request: Request) {
  const denied = requireBypass(request)
  if (denied) return denied

  try {
    const list = await agents.list()
    return NextResponse.json(list)
  } catch (error) {
    console.error('Error fetching agents:', error)
    return NextResponse.json(
      { error: 'Failed to fetch agents' },
      { status: 500 },
    )
  }
}
