import { NextResponse } from 'next/server'
import { agents } from '@/lib/registry'

export const dynamic = 'force-static'

export async function GET() {
  const list = await agents.list()
  return NextResponse.json(list)
}
