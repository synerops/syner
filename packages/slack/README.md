# @syner/slack

Slack integration for Syner.

## Quick Setup

### 1. Create Slack App

Go to [api.slack.com/apps](https://api.slack.com/apps) → Create New App → From scratch

### 2. Add Bot Scopes

**OAuth & Permissions** → **Bot Token Scopes**:

```
app_mentions:read    # Receive @mentions
channels:history     # Read channel messages
chat:write           # Send messages
commands             # Slash commands
users:read           # Get user info (required by Chat SDK)
```

### 3. Enable Events

**Event Subscriptions** → Enable → Set Request URL:
```
https://your-domain/api/chat-poc
```

**Subscribe to bot events**:
- `app_mention`

### 4. Add Slash Command

**Slash Commands** → Create:

| Field | Value |
|-------|-------|
| Command | `/syner` |
| Request URL | `https://your-domain/api/commands/slack` |
| Description | Invoke Syner skills |
| Usage Hint | `[command] [args]` |

### 5. Install App

**Install App** → Install to Workspace → Copy **Bot User OAuth Token**

### 6. Environment Variables

```bash
SLACK_BOT_TOKEN=xoxb-...        # Bot User OAuth Token
SLACK_SIGNING_SECRET=...        # Basic Information → Signing Secret
```

### 7. Configure Agent

Add the channel ID to an agent in `agents/*.md`:

```yaml
---
name: syner
channel: C1234567890   # Get this from @mentioning the bot
---
```

If you @mention the bot in an unconfigured channel, it will tell you the channel ID.

## Expose Skills as Commands

Add `command:` to a skill's frontmatter:

```yaml
---
name: create-syner-skill
command: create-skill
description: Create a new skill
---
```

Now `/syner create-skill [args]` invokes that skill.

`/syner help` lists all available commands.

## Usage

### Event Handler (Next.js Route)

```typescript
import { after } from 'next/server'
import { createHandler, createSlackClient } from '@syner/slack'

const client = createSlackClient({ botToken: process.env.SLACK_BOT_TOKEN! })

export const POST = createHandler({
  signingSecret: process.env.SLACK_SIGNING_SECRET!,
  afterFn: after,
  onAppMention: async (event, envelope) => {
    await sendReply(client, event.channel, event.ts, 'Hello!')
  },
})
```

### Slash Command Handler

```typescript
import { after } from 'next/server'
import { createCommandHandler } from '@syner/slack'
import type { SlackSlashCommand } from '@syner/slack'

export const POST = createCommandHandler({
  signingSecret: process.env.SLACK_SIGNING_SECRET!,
  afterFn: after,
  onCommand: async (command: SlackSlashCommand) => {
    return { text: `Received: ${command.text}`, response_type: 'ephemeral' }
  },
})
```

### Streaming Replies

```typescript
import { createSlackClient, streamReply } from '@syner/slack'

const client = createSlackClient({ botToken: process.env.SLACK_BOT_TOKEN! })

await streamReply(client, {
  channel: 'C1234567890',
  threadTs: '1234567890.123456',
  teamId: 'T1234',
  userId: 'U1234',
  textStream: someAsyncIterable,
  updateIntervalMs: 500,
})
```

### Messaging Functions

```typescript
import { sendReply, addReaction, removeReaction } from '@syner/slack'

// Send a threaded reply (returns message timestamp)
const ts = await sendReply(client, channel, threadTs, 'Response text')

// Add/remove reactions
await addReaction(client, channel, messageTs, 'eyes')
await removeReaction(client, channel, messageTs, 'eyes')
```

### Chat SDK Integration

```typescript
import { after } from 'next/server'
import { createSlackChat } from '@syner/slack'
import type { MentionContext } from '@syner/slack'

const { webhooks } = createSlackChat(
  {
    botToken: process.env.SLACK_BOT_TOKEN!,
    signingSecret: process.env.SLACK_SIGNING_SECRET!,
    botName: 'Syner',
  },
  {
    onMention: async (context: MentionContext) => {
      // context.text     -- cleaned message text
      // context.channel  -- channel ID
      // context.threadId -- thread identifier (always present)
      // context.userId   -- author's user ID
      return `You said: ${context.text}`
    },
  }
)

// Wire up the webhook endpoint
export async function POST(request: Request) {
  return webhooks(request)
}
```
