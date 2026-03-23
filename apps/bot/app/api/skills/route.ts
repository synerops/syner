import { NextResponse } from 'next/server'
import { requireBypass } from '@/lib/bypass'
import { skills } from '@/lib/registry'

export const dynamic = 'force-static'

export async function GET(request: Request) {
  const denied = requireBypass(request)
  if (denied) return denied

  try {
    const list = await skills.list()
    return NextResponse.json(list)
  } catch (error) {
    console.error('Error fetching skills:', error)
    return NextResponse.json(
      { error: 'Failed to fetch skills' },
      { status: 500 },
    )
  }
}
