import { runtime, ensureStarted } from '@/lib/runtime'

export const maxDuration = 60

export async function POST(request: Request) {
  const { prompt, agent: agentName } = await request.json() as { prompt?: string; agent?: string }

  if (!prompt) {
    return Response.json({ error: 'prompt required' }, { status: 400 })
  }

  const requestId = crypto.randomUUID()
  const name = agentName || 'syner'

  console.log(`[Chat] request=${requestId} agent=${name}`)

  await ensureStarted()

  try {
    const agent = runtime.agent(name)
    const result = await agent.spawn(prompt)

    console.log(`[Chat] request=${requestId} agent=${name} steps=${result.output?.steps} verification=${result.verification.status}`)

    return Response.json({
      text: result.output?.text || '',
      agent: name,
      steps: result.output?.steps,
      toolCalls: result.output?.toolCalls,
    })
  } catch (error) {
    console.error(`[Chat] request=${requestId} agent=${name} error:`, error instanceof Error ? error.message : String(error))

    return Response.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    )
  }
}
