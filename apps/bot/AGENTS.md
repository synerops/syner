# syner.bot

Integration platform — receives webhooks from GitHub, Slack, and more. Responds using AI agents with tool access.

## Structure

<!-- auto:structure -->
```
apps/bot/
├── app/
│   └── api/
│       ├── chat/route.ts           # Direct chat endpoint (local dev)
│       └── webhooks/
│           ├── github/route.ts     # GitHub webhook handler
│           └── slack/route.ts      # Slack webhook handler
├── agents/
│   └── bot.md                      # Lead agent definition
├── lib/
│   ├── agents/
│   │   ├── index.ts                # Agent exports
│   │   ├── loader.ts               # Load agents from markdown
│   │   └── models.ts               # Model configuration
│   ├── tools/
│   │   ├── index.ts                # Tool exports
│   │   └── registry.ts             # Tool session management
│   ├── env.ts                      # Environment validation
│   ├── errors.ts                   # Error handling
│   └── logger.ts                   # Logging utilities
├── skills/
│   └── vercel-setup/SKILL.md       # Deployment configuration skill
└── vaults/
    └── bot/index.md                # Bot-specific context
```
<!-- /auto:structure -->

## Conventions

- **Webhooks** go in `app/api/webhooks/{platform}/route.ts`
- **Agents** defined in markdown with YAML frontmatter specifying tools
- **Tools** come from `@syner/vercel` package
- **Skills** in `skills/{name}/SKILL.md`

## Webhook flow

```
Request → Verify signature → Find agent for channel → Create sandbox → ToolLoopAgent → Response
```

1. Webhook receives event (GitHub mention, Slack message)
2. Signature verified using platform secret
3. Agent loaded based on channel mapping
4. Vercel Sandbox created with repo cloned
5. ToolLoopAgent runs with tools (Bash, Read, Grep, etc.)
6. Response posted back to platform

## Adding a new integration

1. Create webhook handler:
   ```
   app/api/webhooks/{platform}/route.ts
   ```

2. Define agent in `agents/{name}.md`:
   ```yaml
   ---
   name: {name}
   model: claude-sonnet-4-5
   tools: [Bash, Read, Grep]
   ---
   ```

3. Add channel mapping in `lib/agents/loader.ts`

4. Add env vars to `.env.example` and `lib/env.ts`

5. Update README.md integrations section

## Available tools

Tools from `@syner/vercel` running in sandbox:

| Tool | Description |
|------|-------------|
| `Bash` | Execute commands |
| `Read` | Read files |
| `Write` | Write files |
| `Glob` | Find files by pattern |
| `Grep` | Search content |
| `Fetch` | Fetch URLs |

## Environment variables

```bash
# Required
ANTHROPIC_API_KEY=

# GitHub
GITHUB_APP_ID=
GITHUB_APP_INSTALLATION_ID=
GITHUB_APP_PRIVATE_KEY=
GITHUB_WEBHOOK_SECRET=

# Slack
SLACK_BOT_TOKEN=
SLACK_SIGNING_SECRET=
```

## What NOT to do

- Don't create tools here — they belong in `packages/vercel`
- Don't hardcode agent instructions — use markdown files
- Don't skip signature verification on webhooks
- Don't store secrets in code — use environment variables
- Don't run agents without sandbox isolation
