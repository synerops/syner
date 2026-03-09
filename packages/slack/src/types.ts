/**
 * Slack API Types
 * Based on Slack Events API and Web API
 */

// Event envelope from Slack
export interface SlackEventEnvelope {
  token: string
  team_id: string
  api_app_id: string
  event: SlackEvent
  type: 'event_callback' | 'url_verification'
  event_id: string
  event_time: number
  authorizations?: SlackAuthorization[]
  is_ext_shared_channel?: boolean
  event_context?: string
}

// URL verification challenge
export interface SlackUrlVerification {
  type: 'url_verification'
  token: string
  challenge: string
}

// Authorization info
export interface SlackAuthorization {
  enterprise_id: string | null
  team_id: string
  user_id: string
  is_bot: boolean
  is_enterprise_install: boolean
}

// Base event type
export interface SlackBaseEvent {
  type: string
  event_ts: string
}

// Message event
export interface SlackMessageEvent extends SlackBaseEvent {
  type: 'message'
  channel: string
  user: string
  text: string
  ts: string
  thread_ts?: string
  subtype?: string
  bot_id?: string
  client_msg_id?: string
  team?: string
  blocks?: unknown[]
  files?: SlackFile[]
}

// App mention event
export interface SlackAppMentionEvent extends SlackBaseEvent {
  type: 'app_mention'
  channel: string
  user: string
  text: string
  ts: string
  thread_ts?: string
  client_msg_id?: string
  team?: string
  blocks?: unknown[]
}

// File attachment
export interface SlackFile {
  id: string
  name: string
  title: string
  mimetype: string
  filetype: string
  url_private: string
  url_private_download?: string
  permalink: string
  size: number
}

// Union type for all events
export type SlackEvent = SlackMessageEvent | SlackAppMentionEvent | SlackBaseEvent

// Type guard for message events
export function isMessageEvent(event: SlackEvent): event is SlackMessageEvent {
  return event.type === 'message'
}

// Type guard for app mention events
export function isAppMentionEvent(event: SlackEvent): event is SlackAppMentionEvent {
  return event.type === 'app_mention'
}

// Type guard for URL verification
export function isUrlVerification(
  payload: SlackEventEnvelope | SlackUrlVerification
): payload is SlackUrlVerification {
  return payload.type === 'url_verification'
}

// Handler configuration
export interface SlackHandlerConfig {
  signingSecret: string
  afterFn?: (callback: () => Promise<void> | void) => void
  onMessage?: (event: SlackMessageEvent, envelope: SlackEventEnvelope) => Promise<void>
  onAppMention?: (event: SlackAppMentionEvent, envelope: SlackEventEnvelope) => Promise<void>
}

// Client configuration
export interface SlackClientConfig {
  botToken: string
}

// Stream reply options
export interface StreamReplyOptions {
  channel: string
  threadTs: string
  teamId: string
  userId: string
  textStream: AsyncIterable<string>
  updateIntervalMs?: number
}
