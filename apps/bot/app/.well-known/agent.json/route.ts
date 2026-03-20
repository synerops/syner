import { runtime } from '@/lib/runtime'

export async function GET() {
  if (runtime.agents.size === 0) await runtime.start()
  return Response.json(runtime.agent('bot').card())
}
