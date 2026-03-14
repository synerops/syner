# @syner/slack

Slack integration layer that handles event ingestion, request verification, markdown conversion, streaming replies, and Chat SDK wiring for the Syner bot. Developers use this for Slack App setup and event handling. Agents use this to understand message routing and type contracts.

## Quick Start

```typescript
import { createSlackChat } from '@syner/slack'
```

## For Developers

### Setup

| Variable | Required | Description |
|----------|----------|-------------|
| `SLACK_BOT_TOKEN` | Yes | Bot User OAuth Token (`xoxb-...`) |
| `SLACK_SIGNING_SECRET` | Yes | Request verification secret |

### Two Integration Paths

**Path 1: Chat SDK (recommended, production path)**

```typescript
import { createSlackChat } from '@syner/slack'

const { webhooks } = createSlackChat(
  { botToken: process.env.SLACK_BOT_TOKEN!, signingSecret: process.env.SLACK_SIGNING_SECRET! },
  {
    async onMention(ctx) {
      return `Echo: ${ctx.text}`
    },
  }
)

export async function POST(request: Request) {
  return webhooks.slack(request, { waitUntil: (p) => after(() => p) })
}
```

**Path 2: Direct handler (lower-level)**

```typescript
import { createHandler } from '@syner/slack'

const handler = createHandler({
  signingSecret: process.env.SLACK_SIGNING_SECRET!,
  afterFn: after,
  onEvent: async (event) => { /* handle event */ },
})

export async function POST(request: Request) {
  return handler(request)
}
```

### Slash Commands

```typescript
import { createCommandHandler } from '@syner/slack'

export const POST = createCommandHandler({
  signingSecret: process.env.SLACK_SIGNING_SECRET!,
  afterFn: after,
  onCommand: async (cmd) => ({
    text: `Received: ${cmd.command} ${cmd.text}`,
    response_type: 'in_channel',
  }),
})
```

### Streaming Replies

```typescript
import { createSlackClient, streamReply } from '@syner/slack'

const client = createSlackClient({ botToken: process.env.SLACK_BOT_TOKEN! })
await streamReply(client, {
  channel: 'C123',
  threadTs: '1234567890.123456',
  teamId: 'T123',
  userId: 'U123',
  textStream: someAsyncIterable,
})
```

### Architecture

```
Slack Event API
    |
    v
@syner/slack (verify signature, parse event)
    |
    ├── Chat SDK path: createSlackChat() -> onMention callback
    └── Direct path: createHandler() -> onEvent callback
            |
            v
        streamReply() -> progressive message updates
```

### Troubleshooting

**"Slack verification failed"**  
Check `SLACK_SIGNING_SECRET`. Must match the value in your Slack App settings.

**Messages appear as "Thinking..." and never update**  
The `textStream` iterable may have errored silently. Check the async generator.

**Duplicate messages**  
Bot loop prevention skips messages from bots, but verify `afterFn` is passed correctly.
