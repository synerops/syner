import { runtime, ensureStarted } from 'syner/run'

export const maxDuration = 60

export async function POST(request: Request) {
  let body: { prompt?: string; agent?: string }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'invalid JSON body' }, { status: 400 })
  }

  const { prompt, agent: agentName } = body

  if (!prompt) {
    return Response.json({ error: 'prompt required' }, { status: 400 })
  }

  const requestId = crypto.randomUUID().slice(0, 8)
  const name = agentName || 'bot'
  const start = Date.now()

  console.log(`\n${'═'.repeat(60)}`)
  console.log(`[${requestId}] Agent: ${name}`)
  console.log(`[${requestId}] Prompt: ${prompt.slice(0, 200)}${prompt.length > 200 ? '...' : ''}`)
  console.log(`${'─'.repeat(60)}`)

  await ensureStarted()

  // Log agent config
  const card = runtime.agents.get(name)
  if (card) {
    console.log(`[${requestId}] Tools declared: [${card.tools?.join(', ')}]`)
    console.log(`[${requestId}] Model: ${card.model || 'sonnet (default)'}`)
    console.log(`[${requestId}] Skills: [${card.skills?.join(', ') || 'none'}]`)
  }

  try {
    const agent = runtime.agent(name)
    const result = await agent.spawn(prompt, {
      onStatus: (status: string) => {
        console.log(`[${requestId}] Status: ${status}`)
      },
      onToolStart: (toolName: string) => {
        console.log(`[${requestId}] ┌ Tool: ${toolName}`)
      },
      onToolFinish: (toolName: string, durationMs: number, success: boolean) => {
        console.log(`[${requestId}] └ Tool: ${toolName} — ${success ? '✓' : '✗'} (${durationMs}ms)`)
      },
      onStepFinish: (stepNumber: number, toolNames: string[]) => {
        console.log(`[${requestId}] Step ${stepNumber}: [${toolNames.join(', ')}]`)
      },
    })

    const elapsed = Date.now() - start
    console.log(`${'─'.repeat(60)}`)
    console.log(`[${requestId}] Done: ${result.output?.steps} steps, ${result.output?.toolCalls?.length || 0} tool calls, ${elapsed}ms`)
    console.log(`[${requestId}] Verification: ${result.verification.status}`)
    console.log(`[${requestId}] Response: ${(result.output?.text || '').slice(0, 200)}${(result.output?.text || '').length > 200 ? '...' : ''}`)
    console.log(`${'═'.repeat(60)}\n`)

    return Response.json({
      text: result.output?.text || '',
      agent: name,
      steps: result.output?.steps,
      toolCalls: result.output?.toolCalls,
      durationMs: elapsed,
    })
  } catch (error) {
    const elapsed = Date.now() - start
    console.error(`[${requestId}] Error (${elapsed}ms):`, error instanceof Error ? error.message : String(error))

    return Response.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    )
  }
}
