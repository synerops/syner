import { runtime, ensureStarted } from 'syner/run'

export async function GET() {
  await ensureStarted()
  return Response.json(runtime.agent('bot').card())
}
