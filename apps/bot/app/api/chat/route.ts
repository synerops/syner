/**
 * Chat API - Main agent endpoint
 *
 * This is the core agent with all tools. Webhooks and other mediums
 * will eventually delegate here.
 *
 * Tools:
 * - web_search: Search the internet
 * - web_fetch: Fetch content from URLs
 */

import { NextRequest, NextResponse } from 'next/server'
import { generateText, stepCountIs } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { logger } from '@/lib/logger'

export const maxDuration = 60

export async function POST(request: NextRequest) {
  const { prompt, system } = await request.json()

  if (!prompt) {
    return NextResponse.json({ error: 'prompt required' }, { status: 400 })
  }

  const tools = {
    web_search: anthropic.tools.webSearch_20250305(),
    web_fetch: anthropic.tools.webFetch_20250910(),
  }

  const requestId = crypto.randomUUID()
  logger.info('Chat request started', { requestId, promptLength: prompt.length })

  try {
    const result = await generateText({
      model: anthropic('claude-sonnet-4-5'),
      system: system || 'You are a helpful assistant with access to web search and web fetch tools. Use them when helpful to answer questions.',
      prompt,
      tools,
      stopWhen: stepCountIs(10),
    })

    const toolCalls = result.steps.flatMap(s =>
      s.toolCalls.map(t => ({ tool: t.toolName, args: t.args }))
    )

    logger.info('Chat request completed', {
      requestId,
      steps: result.steps.length,
      toolCalls: toolCalls.map(t => t.tool),
    })

    return NextResponse.json({
      text: result.text,
      steps: result.steps.length,
      toolCalls,
    })
  } catch (error) {
    logger.error('Chat request failed', {
      requestId,
      error: error instanceof Error ? error.message : String(error),
    })
    throw error
  }
}
