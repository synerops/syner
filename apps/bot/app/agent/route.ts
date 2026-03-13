import { getInstanceCard, getRequestScope } from '../../lib/instance'
import { createSession } from '../../lib/session'

export async function GET(request: Request) {
  const scope = getRequestScope(request)
  const card = await getInstanceCard(scope)
  return Response.json(card)
}

export async function POST(request: Request) {
  const body = await request.json() as {
    prompt: string
    context?: { scope?: string; app?: string; query?: string }
    threadId?: string
  }

  if (!body.prompt) {
    return Response.json({ error: 'prompt is required' }, { status: 400 })
  }

  const session = await createSession({
    onResult: async (result) => {
      // Hook point for logging, storage, or follow-up chains
      console.log(`[agent] result: ${result.verification.status}`)
    },
  })

  try {
    const result = await session.generate(body.prompt)
    return Response.json(result)
  } finally {
    await session.cleanup()
  }
}
