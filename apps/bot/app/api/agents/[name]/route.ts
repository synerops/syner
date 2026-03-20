import { NextResponse } from 'next/server'
import { runtime } from '@/lib/runtime'

// ISR: revalidate every hour
export const revalidate = 3600

// Only serve pre-generated routes, never call fs at runtime
export const dynamicParams = false

// Pre-generate routes for all agents at build time
export async function generateStaticParams() {
  if (runtime.agents.size === 0) await runtime.start()
  return [...runtime.agents.keys()].map(name => ({ name }))
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  // In Vercel: require bypass header
  if (process.env.VERCEL_URL) {
    const bypass = request.headers.get('x-vercel-protection-bypass')
    if (bypass !== process.env.VERCEL_AUTOMATION_BYPASS_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const { name } = await params
  if (runtime.agents.size === 0) await runtime.start()

  try {
    return NextResponse.json(runtime.agent(name).card())
  } catch {
    return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
  }
}
