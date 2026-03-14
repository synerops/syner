# @syner/slack

### Exports

```typescript
import {
  createSlackChat,
  createHandler,
  createCommandHandler,
  createSlackClient,
  streamReply,
  sendReply,
  convertMarkdown,
  type SlackEvent,
  type SlackCommandPayload,
  type SlackMentionContext,
} from '@syner/slack'
```

### Key Types

```typescript
interface SlackMentionContext {
  text: string       // cleaned mention text
  channel: string    // channel ID
  threadId?: string  // thread timestamp
  userId: string     // sender user ID
}

interface SlackCommandPayload {
  command: string
  text: string
  response_url: string
  trigger_id: string
  channel_id: string
  user_id: string
}
```

### Functions

| Function | Signature | Description |
|----------|-----------|-------------|
| `createSlackChat` | `(config, handlers) => { webhooks }` | Chat SDK path — recommended |
| `createHandler` | `(opts) => (req: Request) => Response` | Direct event handler |
| `createCommandHandler` | `(opts) => (req: Request) => Response` | Slash command handler |
| `streamReply` | `(client, opts) => Promise<void>` | Progressive message updates |
| `sendReply` | `(client, opts) => Promise<void>` | Single message reply |
| `convertMarkdown` | `(md: string) => string` | Markdown → mrkdwn |
| `createSlackClient` | `(opts) => WebClient` | Raw Slack WebClient |

### Constraints

1. **`streamReply` requires a thread** — `threadTs` is mandatory. Calling without it silently fails.
2. **Always convert to mrkdwn** — Slack renders markdown incorrectly. Use `convertMarkdown()` or let `streamReply`/`sendReply` handle it automatically.
3. **Rate limiting** — `streamReply` rate-limits updates to 500ms by default. Do not override below 300ms or Slack will throttle.
4. **3-second acknowledgment deadline** — Slack expects a response within 3 seconds. Use `afterFn` (Next.js `after()`) for background processing.
5. **Bot loop prevention** — `createHandler` and `createSlackChat` skip bot messages automatically. Do not add your own bot-detection logic.
6. **Barrel imports only** — Import from `@syner/slack`, not from subpaths. There is one export path.
7. **Two paths are mutually exclusive** — Use Chat SDK path OR direct handler path. Do not mix `createSlackChat` with `createHandler` in the same route.

### Dependencies

| Package | Why |
|---------|-----|
| `@slack/web-api` | Slack Web API client |
| `chat` + `@chat-adapter/slack` | Chat SDK stack |
| `md-to-slack` | Markdown conversion |

### Status

Experimental (v0.0.1). Both paths deployed in `apps/bot`. API surface not yet stabilized.

-- syner/slack


