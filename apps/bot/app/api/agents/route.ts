import { NextResponse } from 'next/server'
import { runtime } from '@/lib/runtime'

// ISR: revalidate every hour
export const revalidate = 3600

export async function GET(request: Request) {
  // In Vercel: require bypass header
  if (process.env.VERCEL_URL) {
    const bypass = request.headers.get('x-vercel-protection-bypass')
    if (bypass !== process.env.VERCEL_AUTOMATION_BYPASS_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  try {
    if (runtime.agents.size === 0) await runtime.start()
    return NextResponse.json([...runtime.agents.values()])
  } catch (error) {
    console.error('Error fetching agents:', error)
    return NextResponse.json(
      { error: 'Failed to fetch agents' },
      { status: 500 },
    )
  }
}
