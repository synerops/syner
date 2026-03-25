import { runtime, ensureStarted } from 'syner/run'

export const maxDuration = 60

export async function POST(request: Request) {
  const { prompt, agent: agentName } = await request.json() as { prompt?: string; agent?: string }

  if (!prompt) {
    return Response.json({ error: 'prompt required' }, { status: 400 })
  }

  const name = agentName || 'vaults'

  await ensureStarted()

  try {
    const agent = runtime.agent(name)
    const result = await agent.spawn(prompt)

    return Response.json({
      text: result.output?.text || '',
      agent: name,
      steps: result.output?.steps,
      toolCalls: result.output?.toolCalls,
    })
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    )
  }
}
