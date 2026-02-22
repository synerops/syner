/**
 * @syner/slack type declarations
 */

import type { WebClient } from '@slack/web-api'

// ============================================================================
// Event Types
// ============================================================================

export interface SlackUrlVerification {
  type: 'url_verification'
  token: string
  challenge: string
}

export interface SlackEventCallback<E = SlackEvent> {
  type: 'event_callback'
  token: string
  team_id: string
  api_app_id: string
  event: E
  event_id: string
  event_time: number
}

export type SlackPayload = SlackUrlVerification | SlackEventCallback

export interface AppMentionEvent {
  type: 'app_mention'
  user: string
  text: string
  ts: string
  channel: string
  event_ts: string
  thread_ts?: string
}

export interface AssistantThreadContext {
  channel_id: string
  team_id: string
  enterprise_id?: string
}

export interface AssistantThread {
  user_id: string
  context: AssistantThreadContext
  channel_id: string
  thread_ts: string
}

export interface AssistantThreadStartedEvent {
  type: 'assistant_thread_started'
  assistant_thread: AssistantThread
}

export interface AssistantThreadContextChangedEvent {
  type: 'assistant_thread_context_changed'
  assistant_thread: AssistantThread
}

export interface MessageEvent {
  type: 'message'
  channel: string
  user: string
  text: string
  ts: string
  thread_ts?: string
  channel_type: 'im' | 'channel' | 'group' | 'mpim'
  subtype?: string
  bot_id?: string
}

export type SlackEvent =
  | AppMentionEvent
  | AssistantThreadStartedEvent
  | AssistantThreadContextChangedEvent
  | MessageEvent

// ============================================================================
// Handler
// ============================================================================

export interface SlackHandlerOptions {
  signingSecret: string
  onAppMention?: (event: AppMentionEvent, envelope: SlackEventCallback<AppMentionEvent>) => Promise<void>
  onAssistantThreadStarted?: (
    event: AssistantThreadStartedEvent,
    envelope: SlackEventCallback<AssistantThreadStartedEvent>
  ) => Promise<void>
  onAssistantThreadContextChanged?: (
    event: AssistantThreadContextChangedEvent,
    envelope: SlackEventCallback<AssistantThreadContextChangedEvent>
  ) => Promise<void>
  onMessage?: (event: MessageEvent, envelope: SlackEventCallback<MessageEvent>) => Promise<void>
}

export declare function createHandler(
  options: SlackHandlerOptions
): (req: Request) => Promise<Response>

// ============================================================================
// Client
// ============================================================================

export type SlackClient = WebClient

export interface SlackClientOptions {
  botToken: string
}

export declare function createSlackClient(options: SlackClientOptions): SlackClient

export interface SendMessageOptions {
  channel: string
  text: string
  threadTs?: string
  mrkdwn?: boolean
}

export declare function sendMessage(
  client: SlackClient,
  options: SendMessageOptions
): Promise<unknown>

export declare function replyInThread(
  client: SlackClient,
  options: { channel: string; threadTs: string; text: string }
): Promise<unknown>

export interface SetAssistantStatusOptions {
  channelId: string
  threadTs: string
  status: string
}

export declare function setAssistantStatus(
  client: SlackClient,
  options: SetAssistantStatusOptions
): Promise<unknown>

export interface SetAssistantTitleOptions {
  channelId: string
  threadTs: string
  title: string
}

export declare function setAssistantTitle(
  client: SlackClient,
  options: SetAssistantTitleOptions
): Promise<unknown>

export interface SuggestedPrompt {
  title: string
  message: string
}

export interface SetAssistantSuggestedPromptsOptions {
  channelId: string
  threadTs: string
  prompts: SuggestedPrompt[]
}

export declare function setAssistantSuggestedPrompts(
  client: SlackClient,
  options: SetAssistantSuggestedPromptsOptions
): Promise<unknown>
