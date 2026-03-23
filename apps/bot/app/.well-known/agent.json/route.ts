import { runtime, ensureStarted } from '@/lib/runtime'

export async function GET() {
  await ensureStarted()
  return Response.json(runtime.agent('bot').card())
}
