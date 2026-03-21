import { NextResponse } from 'next/server'

/**
 * Verify VERCEL_AUTOMATION_BYPASS_SECRET header.
 * Returns a 401 Response if invalid, null if OK.
 */
export function requireBypass(request: Request): NextResponse | null {
  if (!process.env.VERCEL_URL) return null

  const bypass = request.headers.get('x-vercel-protection-bypass')
  if (bypass !== process.env.VERCEL_AUTOMATION_BYPASS_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return null
}
