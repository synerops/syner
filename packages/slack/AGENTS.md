# @syner/slack -- Agent Reference

Complete export reference for `@syner/slack`. Source of truth: `src/index.ts` re-exports from 5 modules.

## Modules

| File | Purpose |
|------|---------|
| `src/types.ts` | Slack API types, event interfaces, type guards |
| `src/client.ts` | WebClient factory, messaging functions (send, stream, reactions) |
| `src/handler.ts` | Next.js route handlers for events and slash commands |
| `src/chat.ts` | Chat SDK adapter for Slack |
| `src/convert.ts` | Markdown to Slack mrkdwn conversion |

## Exported Types

### Event Types

```typescript
interface SlackEventEnvelope {
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

interface SlackUrlVerification {
  type: 'url_verification'
  token: string
  challenge: string
}

interface SlackAuthorization {
  enterprise_id: string | null
  team_id: string
  user_id: string
  is_bot: boolean
  is_enterprise_install: boolean
}

interface SlackBaseEvent {
  type: string
  event_ts: string
}

interface SlackMessageEvent extends SlackBaseEvent {
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

interface SlackAppMentionEvent extends SlackBaseEvent {
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

interface SlackFile {
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

type SlackEvent = SlackMessageEvent | SlackAppMentionEvent | SlackBaseEvent
```

### Configuration Types

```typescript
interface SlackClientConfig {
  botToken: string
}

interface SlackHandlerConfig {
  signingSecret: string
  afterFn?: (callback: () => Promise<void> | void) => void
  onMessage?: (event: SlackMessageEvent, envelope: SlackEventEnvelope) => Promise<void>
  onAppMention?: (event: SlackAppMentionEvent, envelope: SlackEventEnvelope) => Promise<void>
}

interface SlackCommandHandlerConfig {
  signingSecret: string
  afterFn?: (callback: () => Promise<void> | void) => void
  onCommand?: (command: SlackSlashCommand) => Promise<SlackCommandResponse | void>
}

interface StreamReplyOptions {
  channel: string
  threadTs: string
  teamId: string
  userId: string
  textStream: AsyncIterable<string>
  updateIntervalMs?: number  // default: 500
}
```

### Slash Command Types

```typescript
interface SlackSlashCommand {
  token: string
  team_id: string
  team_domain: string
  enterprise_id?: string
  enterprise_name?: string
  channel_id: string
  channel_name: string
  user_id: string
  user_name: string
  command: string
  text: string
  api_app_id: string
  is_enterprise_install: string
  response_url: string
  trigger_id: string
}

interface SlackCommandResponse {
  text: string
  response_type?: 'ephemeral' | 'in_channel'
  blocks?: unknown[]
}
```

### Chat SDK Types

```typescript
interface SlackChatConfig {
  botToken: string
  signingSecret: string
  botName?: string
}

interface MentionHandler {
  onMention: (context: MentionContext) => Promise<string>
}

interface MentionContext {
  text: string       // cleaned message text (bot mention stripped)
  channel: string    // channel ID (slack: prefix stripped)
  threadId: string   // REQUIRED -- thread identifier
  userId: string     // author's user ID
}
```

Note: `Chat` and `SlackAdapter` are re-exported from `chat` and `@chat-adapter/slack` respectively.

## Exported Functions

### Client & Messaging (`src/client.ts`)

```typescript
function createSlackClient(config: SlackClientConfig): WebClient

function sendReply(
  client: WebClient,
  channel: string,
  threadTs: string,
  text: string
): Promise<string | undefined>

function streamReply(
  client: WebClient,
  options: StreamReplyOptions
): Promise<void>

function addReaction(
  client: WebClient,
  channel: string,
  timestamp: string,
  emoji: string
): Promise<void>

function removeReaction(
  client: WebClient,
  channel: string,
  timestamp: string,
  emoji: string
): Promise<void>
```

### Handlers (`src/handler.ts`)

```typescript
function createHandler(config: SlackHandlerConfig): (request: Request) => Promise<Response>

function createCommandHandler(config: SlackCommandHandlerConfig): (request: Request) => Promise<Response>
```

Both handlers verify Slack request signatures (HMAC-SHA256, timing-safe) and reject requests older than 5 minutes.

### Chat SDK (`src/chat.ts`)

```typescript
function createSlackChat(
  config: SlackChatConfig,
  handler: MentionHandler
): { chat: Chat; slack: SlackAdapter; webhooks: Chat['webhooks'] }
```

### Conversion (`src/convert.ts`)

```typescript
function convertMarkdown(text: string): string
```

Converts standard markdown to Slack mrkdwn. Used internally by `sendReply`, `streamReply`, and command responses.

## Type Guards

```typescript
function isMessageEvent(event: SlackEvent): event is SlackMessageEvent
function isAppMentionEvent(event: SlackEvent): event is SlackAppMentionEvent
function isUrlVerification(payload: SlackEventEnvelope | SlackUrlVerification): payload is SlackUrlVerification
```

## Dependencies

| Package | Purpose |
|---------|---------|
| `@slack/web-api` | Slack WebClient |
| `chat` | Vercel Chat SDK |
| `@chat-adapter/slack` | Chat SDK Slack adapter |
| `@chat-adapter/state-memory` | In-memory state for Chat SDK |
| `md-to-slack` | Markdown to mrkdwn conversion |
