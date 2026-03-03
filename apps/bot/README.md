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

## environment variables

copy `.env.example` to `.env.local` and fill in the values.

### required

| variable | where to get it |
|----------|-----------------|
| `ANTHROPIC_API_KEY` | [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys) → Create Key |
| `GITHUB_APP_ID` | [github.com/settings/apps/synerbot](https://github.com/settings/apps/synerbot) → App ID (top of page) |
| `GITHUB_APP_INSTALLATION_ID` | After installing app, check URL: `github.com/settings/installations/<ID>` |
| `GITHUB_APP_PRIVATE_KEY` | App settings → Private keys → Generate |
| `GITHUB_WEBHOOK_SECRET` | App settings → Webhook → Secret |

### optional

| variable | where to get it |
|----------|-----------------|
| `SLACK_WEBHOOK_URL` | [api.slack.com/apps](https://api.slack.com/apps) → Your App → Incoming Webhooks |
| `CRON_SECRET` | Generate with `openssl rand -hex 32` |

### webhook secret setup

`GITHUB_WEBHOOK_SECRET` is a shared secret used to verify that webhooks come from GitHub, not an attacker.

**It must be configured in TWO places with the SAME value:**

```
┌─────────────────┐         ┌─────────────────┐
│   GitHub App    │         │     Vercel      │
│                 │         │                 │
│  Webhook Secret │ ══════> │ Env Variable    │
│  (signs payload)│  SAME   │ (verifies sig)  │
└─────────────────┘         └─────────────────┘
```

**Step 1: Generate the secret**

```bash
openssl rand -hex 32
```

Save this value - you'll need it twice.

**Step 2: Add to Vercel**

```bash
vercel env add GITHUB_WEBHOOK_SECRET production
# paste the secret when prompted
```

Or via Dashboard: Project Settings → Environment Variables → Add `GITHUB_WEBHOOK_SECRET`

**Step 3: Add to GitHub App**

1. Go to [github.com/settings/apps/synerbot](https://github.com/settings/apps/synerbot)
2. Scroll to **Webhook** section
3. Paste the same secret in **Webhook secret** field
4. Save changes

**How it works:**

```
GitHub receives event (issue comment, PR, etc.)
    ↓
Signs payload: HMAC-SHA256(payload, secret)
    ↓
Sends to your webhook URL with X-Hub-Signature-256 header
    ↓
Vercel function verifies signature using same secret
    ↓
If valid → process event
If invalid → 401 Unauthorized (blocks attackers)
```

### vercel deployment

1. link project: `vercel link`
2. add env vars in [Vercel Dashboard](https://vercel.com/synerops/functions/settings/environment-variables)
3. or via CLI:
   ```bash
   vercel env add ANTHROPIC_API_KEY production
   vercel env add GITHUB_APP_ID production
   vercel env add GITHUB_APP_INSTALLATION_ID production
   vercel env add GITHUB_APP_PRIVATE_KEY production
   vercel env add GITHUB_WEBHOOK_SECRET production
   ```

### github app setup

if you need to create a new GitHub App:

1. go to [github.com/settings/apps/new](https://github.com/settings/apps/new)
2. configure:
   - **name**: synerbot (or your preferred name)
   - **homepage**: https://syner.bot
   - **webhook url**: https://syner.bot/api/webhooks/github
   - **webhook secret**: generate and save for `GITHUB_WEBHOOK_SECRET`
3. permissions:
   - **repository**: contents (read), issues (read/write), pull requests (read/write)
   - **organization**: members (read)
4. subscribe to events: `issues`, `issue_comment`, `pull_request`
5. generate private key → save for `GITHUB_APP_PRIVATE_KEY`
6. install on your org/repos
7. get installation ID from URL after install

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
