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

## stack

- vercel serverless functions
- bun runtime
- packages: `@syner/github`, `@syner/slack`

## github configuration

the repository uses GitHub Actions for automation. configure these secrets in **Settings → Secrets and variables → Actions**:

| secret | required | used by | description |
|--------|----------|---------|-------------|
| `ANTHROPIC_API_KEY` | yes* | `claude.yml` | API key from [console.anthropic.com](https://console.anthropic.com) |
| `CLAUDE_CODE_OAUTH_TOKEN` | yes* | `claude.yml` | alternative: OAuth token for Claude Code |
| `NPM_TOKEN` | yes | `release.yml` | npm publish token from [npmjs.com](https://www.npmjs.com/settings/~/tokens) |

*one of `ANTHROPIC_API_KEY` or `CLAUDE_CODE_OAUTH_TOKEN` is required for Claude Assistant.

### workflows

| workflow | trigger | purpose |
|----------|---------|---------|
| `claude.yml` | `@claude` mention, assignment, label | Claude responds to issues/PRs |
| `release.yml` | push to main | creates release PRs and publishes to npm |

## setup

copy `.env.example` to `.env.local` and fill in the values.

### anthropic

| variable | where to get it |
|----------|-----------------|
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com/settings/keys) → Create Key |

### github

| variable | where to get it |
|----------|-----------------|
| `GITHUB_APP_ID` | [App settings](https://github.com/settings/apps/synerbot) → top of page |
| `GITHUB_APP_INSTALLATION_ID` | URL after installing: `/installations/<ID>` |
| `GITHUB_APP_PRIVATE_KEY` | App settings → Private keys → Generate |
| `GITHUB_WEBHOOK_SECRET` | `openssl rand -hex 32` → add to [app webhook settings](https://github.com/settings/apps/synerbot) AND Vercel |

### slack (optional)

| variable | where to get it |
|----------|-----------------|
| `SLACK_WEBHOOK_URL` | [api.slack.com/apps](https://api.slack.com/apps) → Incoming Webhooks |

### vercel

| variable | where to get it |
|----------|-----------------|
| `CRON_SECRET` | `openssl rand -hex 32` |

deploy: `vercel link` then add env vars via dashboard or `vercel env add <VAR> production`

## local development

```bash
bun run dev --filter=bot
```

runs on `localhost:3001`
