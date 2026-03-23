import { NextResponse } from 'next/server'
import { skills } from '@/lib/registry'

export const dynamic = 'force-static'

export async function GET() {
  const list = await skills.list()
  return NextResponse.json(list)
}
