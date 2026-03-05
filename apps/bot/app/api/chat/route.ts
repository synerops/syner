import { streamText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { logger } from '@/lib/logger'

export const maxDuration = 60

export async function POST(request: Request) {
  const { messages } = await request.json()

  logger.info('Chat request', { messageCount: messages.length })

  const result = streamText({
    model: anthropic('claude-sonnet-4-20250514'),
    system: `You are synerbot, a helpful AI assistant. Be concise and direct.`,
    messages,
  })

  return result.toDataStreamResponse()
}
