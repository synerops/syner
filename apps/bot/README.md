# syner.bot

integration platform - receives webhooks, responds as @synerbot.

## why syner.bot

- the listener - receives events from GitHub, Slack, and more
- loads your notes as context before responding
- one place for all integrations, powered by your knowledge

## how it works

1. someone mentions @synerbot in a GitHub issue/PR
2. GitHub sends webhook to syner.bot
3. bot verifies sender has repo access
4. bot loads context (CLAUDE.md, changed files, conversation)
5. Claude generates response with tools
6. bot posts comment

## try it

```bash
bun run dev --filter=bot
```

runs on localhost:3001. to test webhooks, use ngrok or deploy.

## integrations

- github - working
- slack - working

## skills

<!-- auto:skills -->
| Skill | Description |
|-------|-------------|
| `/vercel-setup` | Configure Vercel environment variables for syner.bot |
<!-- /auto:skills -->

## setup

1. copy [`.env.example`](.env.example) to `.env.local`
2. fill in the values (see below)
3. run `bun run dev`

## environment variables

**Required:**

- `ANTHROPIC_API_KEY` - [Get from Anthropic Console](https://console.anthropic.com/settings/keys)
- `GITHUB_APP_ID` - From your GitHub App settings
- `GITHUB_APP_INSTALLATION_ID` - From installation URL after installing the app
- `GITHUB_APP_PRIVATE_KEY` - Generate in GitHub App settings → Private keys
- `GITHUB_WEBHOOK_SECRET` - Set in GitHub App settings → Webhook → Secret

**Optional:**

- `SLACK_BOT_TOKEN` - For Slack integration
- `SLACK_SIGNING_SECRET` - For Slack webhook verification
- `CRON_SECRET` - Protects cron endpoints

See [`.env.example`](.env.example) for detailed instructions on where to find each value.
