/**
 * Chat SDK Integration
 *
 * Unified messaging using Vercel Chat SDK with Slack adapter.
 */

import { Chat, type Thread, type Message } from 'chat'
import { SlackAdapter } from '@chat-adapter/slack'
import { createMemoryState } from '@chat-adapter/state-memory'

export interface SlackChatConfig {
  botToken: string
  signingSecret: string
  botName?: string
}

export interface MentionHandler {
  onMention: (context: MentionContext) => Promise<string>
}

export interface MentionContext {
  text: string
  channel: string
  threadId: string
  userId: string
}

/**
 * Create a Chat SDK instance configured for Slack
 */
export function createSlackChat(config: SlackChatConfig, handler: MentionHandler) {
  const slack = new SlackAdapter({
    botToken: config.botToken,
    signingSecret: config.signingSecret,
  })

  const state = createMemoryState()

  const chat = new Chat({
    adapters: { slack },
    state,
    userName: config.botName || 'Syner',
  })

  // Handle incoming @-mentions of the bot
  chat.onNewMention(async (thread: Thread, message: Message) => {
    // Chat SDK prefixes channel IDs with "slack:", strip it
    const channelId = thread.channel.id.replace(/^slack:/, '')

    // Strip the bot self-mention from the text (e.g., "@U0AGSRGGKAM hello" → "hello")
    const cleanText = message.text.replace(/^@\w+\s*/, '').trim()

    const context: MentionContext = {
      text: cleanText,
      channel: channelId,
      threadId: thread.id,
      userId: message.author.userId,
    }

    try {
      const response = await handler.onMention(context)
      await thread.post(response)
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      await thread.post(`_Error: ${errorMsg}_`)
    }
  })

  return {
    chat,
    slack,
    webhooks: chat.webhooks,
  }
}

export { Chat, SlackAdapter }
