/**
 * Chat API - Unified agent endpoint
 *
 * Same behavior as Slack webhook, but for local testing.
 * Uses the same session system: agent config, sandbox, tools, skills.
 *
 * @example
 * ```bash
 * curl -X POST http://localhost:3000/api/chat \
 *   -H "Content-Type: application/json" \
 *   -d '{"prompt": "list available skills"}'
 *
 * # With specific agent
 * curl -X POST http://localhost:3000/api/chat \
 *   -d '{"prompt": "list files", "agent": "test-slack"}'
 * ```
 */

import { NextRequest, NextResponse } from 'next/server'
import { createSession } from '@/lib/session'
import { logger } from 'syner/logger'

export const maxDuration = 60

interface ChatRequest {
  prompt: string
  agent?: string
}

export async function POST(request: NextRequest) {
  const { prompt, agent }: ChatRequest = await request.json()

  if (!prompt) {
    return NextResponse.json({ error: 'prompt required' }, { status: 400 })
  }

  const requestId = crypto.randomUUID()
  const agentName = agent || 'syner'

  logger.info('Chat request started', { requestId, agent: agentName, promptLength: prompt.length })

  let session

  try {
    session = await createSession({
      agentName,
      onStatus: (status) => {
        logger.debug('Session status', { requestId, status })
      },
      onToolStart: (toolName) => {
        logger.debug('Tool started', { requestId, tool: toolName })
      },
      onToolFinish: (toolName, durationMs, success) => {
        logger.debug('Tool finished', { requestId, tool: toolName, durationMs, success })
      },
    })

    const result = await session.generate(prompt)

    logger.info('Chat request completed', {
      requestId,
      agent: agentName,
      steps: result.output?.steps,
      toolCalls: result.output?.toolCalls,
      verification: result.verification.status,
    })

    return NextResponse.json({
      text: result.output?.text || '',
      agent: agentName,
      steps: result.output?.steps,
      toolCalls: result.output?.toolCalls,
    })
  } catch (error) {
    logger.error('Chat request failed', {
      requestId,
      agent: agentName,
      error: error instanceof Error ? error.message : String(error),
    })

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  } finally {
    if (session) {
      await session.cleanup()
    }
  }
}
