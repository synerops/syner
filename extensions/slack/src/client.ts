/**
 * Slack Client
 *
 * Thin wrapper over @slack/web-api WebClient.
 * Exposes methods matching the bot scopes:
 * - chat:write (sendMessage, replyInThread)
 * - im:write (same methods, DM channels)
 * - assistant:write (setStatus, setTitle, setSuggestedPrompts)
 */

import { WebClient } from '@slack/web-api'
import type { SlackClientOptions } from './types'

export type SlackClient = WebClient

/**
 * Creates an authenticated Slack Web API client.
 *
 * @example
 * ```ts
 * const client = createSlackClient({ botToken: process.env.SLACK_BOT_TOKEN! })
 * await sendMessage(client, { channel: 'C123', text: 'Hello!' })
 * ```
 */
export function createSlackClient(options: SlackClientOptions): SlackClient {
  return new WebClient(options.botToken)
}

// ============================================================================
// chat:write + im:write
// ============================================================================

export interface SendMessageOptions {
  channel: string
  text: string
  threadTs?: string
  mrkdwn?: boolean
}

/**
 * Sends a message to a channel or DM.
 */
export async function sendMessage(client: SlackClient, options: SendMessageOptions) {
  return client.chat.postMessage({
    channel: options.channel,
    text: options.text,
    thread_ts: options.threadTs,
    mrkdwn: options.mrkdwn ?? true,
  })
}

/**
 * Replies in a thread. Shorthand for sendMessage with threadTs.
 */
export async function replyInThread(
  client: SlackClient,
  options: { channel: string; threadTs: string; text: string }
) {
  return sendMessage(client, {
    channel: options.channel,
    text: options.text,
    threadTs: options.threadTs,
  })
}

// ============================================================================
// assistant:write
// ============================================================================

export interface SetAssistantStatusOptions {
  channelId: string
  threadTs: string
  status: string
}

/**
 * Sets the assistant's typing/processing status in a thread.
 */
export async function setAssistantStatus(client: SlackClient, options: SetAssistantStatusOptions) {
  return client.assistant.threads.setStatus({
    channel_id: options.channelId,
    thread_ts: options.threadTs,
    status: options.status,
  })
}

export interface SetAssistantTitleOptions {
  channelId: string
  threadTs: string
  title: string
}

/**
 * Sets the title of an assistant thread.
 */
export async function setAssistantTitle(client: SlackClient, options: SetAssistantTitleOptions) {
  return client.assistant.threads.setTitle({
    channel_id: options.channelId,
    thread_ts: options.threadTs,
    title: options.title,
  })
}

export interface SuggestedPrompt {
  title: string
  message: string
}

export interface SetAssistantSuggestedPromptsOptions {
  channelId: string
  threadTs: string
  prompts: SuggestedPrompt[]
}

/**
 * Sets suggested prompts for the assistant thread.
 */
export async function setAssistantSuggestedPrompts(
  client: SlackClient,
  options: SetAssistantSuggestedPromptsOptions
) {
  return client.assistant.threads.setSuggestedPrompts({
    channel_id: options.channelId,
    thread_ts: options.threadTs,
    prompts: options.prompts,
  })
}
