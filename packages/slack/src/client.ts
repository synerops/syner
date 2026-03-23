import { WebClient } from '@slack/web-api'
import type { SlackClientConfig, StreamReplyOptions } from './types'
import { convertMarkdown } from './convert'

/**
 * Create a Slack Web API client
 */
export function createSlackClient(config: SlackClientConfig): WebClient {
  return new WebClient(config.botToken)
}

/**
 * Stream a reply to Slack, updating the message as content arrives
 * Posts initial message immediately, then updates with streamed content
 */
export async function streamReply(
  client: WebClient,
  options: StreamReplyOptions
): Promise<void> {
  const {
    channel,
    threadTs,
    textStream,
    updateIntervalMs = 500,
  } = options

  let fullText = ''
  let lastUpdate = 0

  // Post initial "thinking" message
  const initialResponse = await client.chat.postMessage({
    channel,
    thread_ts: threadTs,
    text: '_Thinking..._',
  })

  const messageTs = initialResponse.ts

  if (!messageTs) {
    throw new Error('Failed to post initial message')
  }

  try {
    for await (const chunk of textStream) {
      fullText += chunk
      const now = Date.now()

      // Rate-limit updates to avoid hitting Slack's API limits
      if (now - lastUpdate >= updateIntervalMs) {
        await client.chat.update({
          channel,
          ts: messageTs,
          text: convertMarkdown(fullText) || '_Thinking..._',
        })
        lastUpdate = now
      }
    }

    // Final update with complete text (converted to Slack mrkdwn)
    if (fullText) {
      await client.chat.update({
        channel,
        ts: messageTs,
        text: convertMarkdown(fullText),
      })
    }
  } catch (error) {
    // If streaming fails, update with error message
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    console.error('[streamReply] Stream error:', errorMsg)
    try {
      await client.chat.update({
        channel,
        ts: messageTs,
        text: `_Error: ${errorMsg}_`,
      })
      console.log('[streamReply] Error message posted to Slack')
    } catch (updateError) {
      console.error('[streamReply] Failed to update message:', updateError)
    }
    throw error
  }
}

/**
 * Send a simple reply in a thread
 */
export async function sendReply(
  client: WebClient,
  channel: string,
  threadTs: string,
  text: string
): Promise<string | undefined> {
  const response = await client.chat.postMessage({
    channel,
    thread_ts: threadTs,
    text: convertMarkdown(text),
  })
  return response.ts
}

/**
 * Add a reaction to a message
 */
export async function addReaction(
  client: WebClient,
  channel: string,
  timestamp: string,
  emoji: string
): Promise<void> {
  await client.reactions.add({
    channel,
    timestamp,
    name: emoji,
  })
}

/**
 * Remove a reaction from a message
 */
export async function removeReaction(
  client: WebClient,
  channel: string,
  timestamp: string,
  emoji: string
): Promise<void> {
  await client.reactions.remove({
    channel,
    timestamp,
    name: emoji,
  })
}
