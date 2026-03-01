# syner.bot

[syner.bot](https://syner.bot) is the integration platform - where syner meets the outside world.

## ecosystem

| domain | role |
|--------|------|
| syner | orchestrator agent that understands your context via markdown |
| syner.md | markdown editor/preview |
| **syner.bot** | integration platform |
| syner.dev | developer portal |

## why syner.bot?

syner.bot is the **listener** - the only place that receives webhooks and responds as @synerbot.

packages (`@syner/github`, `@syner/slack`) are **tools** - any app can import them directly.

| component | role | direction |
|-----------|------|-----------|
| `@syner/*` packages | tools to call services | app → service |
| `syner.bot` | agent that listens and responds | service → agent → service |

```
@synerbot mentioned in PR
    ↓
GitHub webhook → syner.bot
    ↓
agent loads context (notes)
    ↓
agent responds using @syner/github
    ↓
user sees reply
```

## package structure

each `@syner/<integration>` has 4 modules:

```
@syner/<integration>/
├── auth/       # authentication (app, oauth, client)
├── events/     # inbound: webhook handling (handler, verify, dispatch)
├── actions/    # outbound: service operations (files, comments, messages)
└── tools/      # agent tools for Claude SDK
```

### @syner/github use cases

| scenario | auth/ | events/ | actions/ | tools/ |
|----------|-------|---------|----------|--------|
| coding agent reads repo files | app | - | files | - |
| syner.md saves notes to GitHub | app | - | files | - |
| bot responds to @synerbot in PR | app | handler | comments | - |
| agent creates PRs | app | - | - | tools |

### @syner/slack use cases

| scenario | auth/ | events/ | actions/ | tools/ |
|----------|-------|---------|----------|--------|
| bot responds to mentions | client | handler | messages | - |
| bot in assistant thread | client | handler | assistant | - |
| agent sends notifications | client | - | messages | - |
| agent searches messages | client | - | - | tools |

## integrations

| service | package | status |
|---------|---------|--------|
| [github](https://github.com/apps/synerbot) | `@syner/github` | auth ready |
| [slack](https://synerops.slack.com/apps/A0AGAF7FTNZ) | `@syner/slack` | planned |
| [x](https://x.com/syner_bot) | `@syner/x` | planned |

## architecture

syner.bot only receives webhooks - no proxy, no auth endpoints.

```
syner.bot/
├── api/
│   └── webhooks/
│       ├── github/route.ts     # receives GitHub events
│       └── slack/route.ts      # receives Slack events
└── lib/
    └── agent.ts                # context loading + response
```

## implementation plan

### phase 1: migrate legacy extensions

adapt code from `~/synerops/legacy/extensions/` to new structure.

### phase 2: scaffold minimal api

```
apps/bot/
├── package.json
├── tsconfig.json
├── vercel.json
└── api/
    └── webhooks/github.ts
```

### phase 3: github webhook

- endpoint: `POST /api/webhooks/github`
- events: `issues`, `pull_request`, `issue_comment`
- handler: use `@syner/github/events`

### phase 4: agent processing

1. verify webhook signature
2. load context (notes, repo state)
3. decide + respond

## stack

- vercel serverless functions
- bun runtime
- packages: `@syner/github`, `@syner/slack`

## local development

```bash
bun run dev --filter=bot
```

runs on `localhost:3001`

## legacy code reference

valuable code in `~/synerops/legacy/extensions/`:

| legacy path | features | migrate to |
|-------------|----------|------------|
| `extensions/github` | app client with throttling, ETag cache, 5 tools | `@syner/github` |
| `extensions/slack` | webhook handler, signature verification, event dispatch | `@syner/slack` |
