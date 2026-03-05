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
- slack - planned

## skills

- `/vercel-setup` - configure deployment

## setup

run `/vercel-setup` or copy `.env.example` to `.env.local`.
