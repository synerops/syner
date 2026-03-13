# Vercel Chat SDK

Research sobre el SDK unificado de Vercel para construir chatbots multiplataforma.

**Fecha:** 2026-03-10
**URLs:**
- https://chat-sdk.dev/
- https://github.com/vercel/chat
- https://vercel.com/blog/introducing-chatbot

## Qué es

Chat SDK es un SDK de TypeScript para construir chatbots que funcionan en múltiples plataformas con un solo codebase. Actualmente en beta, open source bajo MIT.

> "Write your bot logic once, deploy everywhere."

## Plataformas soportadas

| Plataforma | Package | Streaming | Cards | Slash Commands |
|------------|---------|-----------|-------|----------------|
| Slack | @chat-adapter/slack | Native API | Block Kit | Yes |
| Microsoft Teams | @chat-adapter/teams | Post+Edit | Adaptive Cards | Yes |
| Google Chat | @chat-adapter/gchat | Post+Edit | Cards | Yes |
| Discord | @chat-adapter/discord | Post+Edit | Embeds | Yes |
| Telegram | @chat-adapter/telegram | Post+Edit | Partial | Yes |
| GitHub | @chat-adapter/github | No | No | No (mentions only) |
| Linear | @chat-adapter/linear | No | No | No (mentions only) |

## Arquitectura

```
┌─────────────────────────────────────────────────────┐
│                   Chat Instance                      │
│  - Event routing                                     │
│  - Handler registration                              │
│  - Cross-platform normalization                      │
└───────────────────┬─────────────────────────────────┘
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
   ┌─────────┐ ┌─────────┐ ┌─────────┐
   │  Slack  │ │  Teams  │ │ Discord │  ... Platform Adapters
   │ Adapter │ │ Adapter │ │ Adapter │
   └─────────┘ └─────────┘ └─────────┘
        │           │           │
        ▼           ▼           ▼
   ┌─────────────────────────────────┐
   │         State Adapter           │  Redis, PostgreSQL, in-memory
   └─────────────────────────────────┘
```

### Componentes principales

1. **Chat** - Entry point que coordina adapters y event routing
2. **Adapters** - Implementaciones específicas por plataforma (webhook parsing, API calls)
3. **State** - Capa de persistencia pluggable (thread subscriptions, distributed locking)

## Features

### Event-Driven Architecture

Handlers que responden a eventos en tiempo real:
- `onNewMention()` - Cuando mencionan al bot
- `onMessage()` - Mensajes en threads suscritos
- `onReaction()` - Reacciones añadidas/removidas
- `onButtonClick()` - Clicks en botones interactivos
- `onSlashCommand()` - Slash commands

### Streaming con AI

First-class support para streaming de LLM responses con rendering nativo por plataforma.

```typescript
chat.onNewMention(async ({ thread }) => {
  const stream = await generateText({ model, prompt })
  await thread.streamReply(stream)
})
```

### Markdown-to-Native Pipeline

Cada adapter convierte automáticamente markdown estándar al formato nativo de la plataforma durante el streaming.

> "Streamed text now passes through each adapter's markdown-to-native conversion pipeline at each intermediate edit."

Para Slack específicamente:
> "Slack's native streaming path now renders bold, italic, lists, and other formatting in real time as the response arrives."

### JSX Cards

Componentes que renderizan nativamente en cada plataforma:

```tsx
<Card>
  <Section>
    <Text>Hello from Chat SDK</Text>
  </Section>
  <Actions>
    <Button action="approve">Approve</Button>
    <Button action="reject" style="danger">Reject</Button>
  </Actions>
</Card>
```

Renderiza como:
- Slack: Block Kit
- Teams: Adaptive Cards
- Discord: Embeds
- Google Chat: Cards

### Table Component

```tsx
<Table
  headers={['Name', 'Status', 'Count']}
  rows={[
    ['Feature A', 'Active', '42'],
    ['Feature B', 'Pending', '17'],
  ]}
/>
```

Conversión por plataforma:
- Slack: Block Kit table blocks
- Teams/Discord: GFM markdown tables
- Google Chat: Monospace text widgets
- Telegram: Code blocks

## Slack Adapter

### Setup básico

```typescript
import { Chat } from 'chat'
import { SlackAdapter } from '@chat-adapter/slack'
import { RedisStateAdapter } from '@chat-state/redis'

const slack = new SlackAdapter({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  botToken: process.env.SLACK_BOT_TOKEN,
})

const chat = new Chat({
  adapters: [slack],
  state: new RedisStateAdapter({ url: process.env.REDIS_URL }),
})

chat.onNewMention(async ({ thread, message }) => {
  await thread.post(`You said: ${message.text}`)
})

export const POST = chat.handler()
```

### Multi-workspace (OAuth)

```typescript
const slack = new SlackAdapter({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  encryptionKey: process.env.SLACK_ENCRYPTION_KEY, // AES-256-GCM
})
```

Tokens se resuelven desde el state adapter usando `team_id`.

### Features específicas de Slack

- **Slack Assistants API**: `setSuggestedPrompts()`, `setAssistantStatus()`, `setAssistantTitle()`
- **Home Tab**: `publishHomeView()`
- **Modals**: Full support
- **Ephemeral messages**: Messages visibles solo para un usuario
- **Typing indicators**: `startTyping()`

## Markdown vs mrkdwn

Slack usa `mrkdwn`, no markdown estándar. El SDK maneja la conversión automáticamente.

| Markdown | Slack mrkdwn |
|----------|--------------|
| `**bold**` | `*bold*` |
| `*italic*` o `_italic_` | `_italic_` |
| `~~strike~~` | `~strike~` |
| `[text](url)` | `<url\|text>` |
| `# Heading` | Sin equivalente (stripped) |
| `![image](url)` | Sin equivalente (stripped) |
| `` `code` `` | `` `code` `` |
| Code blocks | Code blocks |

### Librerías alternativas para conversión manual

- **JavaScript**: [md-to-slack](https://github.com/nicoespeon/md-to-slack)
- **Python**: [markdown-to-mrkdwn](https://pypi.org/project/markdown-to-mrkdwn/)
- **Online tool**: https://markdown-to-mrkdwn.vercel.app/

## State Adapters

| Adapter | Package | Use case |
|---------|---------|----------|
| Redis | @chat-state/redis | Production, distributed |
| PostgreSQL | @chat-state/postgres | When already using PG |
| ioredis | @chat-state/ioredis | Cluster support |
| In-memory | Built-in | Development only |

State maneja:
- Thread subscriptions
- Distributed locking
- Message deduplication
- OAuth token storage (multi-workspace)

## Comparación con Bolt for Slack

| Aspecto | Bolt for Slack | Chat SDK |
|---------|----------------|----------|
| Plataformas | Solo Slack | 7 plataformas |
| Streaming | Manual | Native support |
| Markdown | Manual conversion | Auto pipeline |
| Cards | Block Kit manual | JSX abstraction |
| State | Custom | Pluggable adapters |
| AI integration | Manual | First-class |

## Project Stats

- **Language**: 93.2% TypeScript
- **Package manager**: pnpm
- **Build**: Turbo, Biome, Vitest
- **Stars**: 1.2k
- **Contributors**: 31
- **License**: MIT

## Links

- Docs: https://chat-sdk.dev/
- GitHub: https://github.com/vercel/chat
- Changelog: https://vercel.com/changelog/chat-sdk-adds-table-rendering-and-streaming-markdown
- Vercel Blog: https://vercel.com/blog/introducing-chatbot
