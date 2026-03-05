# README Examples

## Placeholder App (syner.md)

Placeholders use "what it will be" + "what works today" instead of "why" + "how it works".

```markdown
# syner.md

personal knowledge management meets AI orchestration. **coming soon.**

## what it will be

- a markdown editor where your notes become context for AI agents
- write freely, agents understand your context
- sync across devices, your data stays yours

## what works today

the **skills** work locally via Claude Code:

- `/syner-find-ideas` - generate ideas from your vault
- `/syner-find-links` - connect two domains
- `/syner-grow-note` - promote thoughts to documents
- `/syner-track-idea` - trace idea evolution
- `/syner-load-all` - load full context from all vaults

your vault lives in `apps/notes/vaults/` - agents read it, you own it.

## try it

\`\`\`bash
bun run dev --filter=notes
\`\`\`

you'll see the landing page. the real value today is skills + local vault.
```

## Functional App (syner.bot)

Functional apps use "why" + "how it works".

```markdown
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

\`\`\`bash
bun run dev --filter=bot
\`\`\`

runs on localhost:3001. to test webhooks, use ngrok or deploy.

## integrations

- github - working
- slack - planned

## skills

- `/vercel-setup` - configure deployment

## setup

run `/vercel-setup` or copy `.env.example` to `.env.local`.
```

## Placeholder with Many Skills (syner.dev)

```markdown
# syner.dev

self-driving development - agents that ship code while you sleep. **coming soon.**

## what it will be

- developer portal for the syner ecosystem
- documentation, guides, and tooling
- CI/CD dashboard and agent logs

## what works today

the **skills** work locally via Claude Code:

### create

- `/create-syner` - orchestrate creation of skills, agents, apps
- `/create-syner-app` - scaffold new apps

### analyze

- `/syner-researcher` - research any topic
- `/syner-backlog-triager` - triage backlog against codebase

## try it

\`\`\`bash
bun run dev --filter=dev
\`\`\`

you'll see the landing page. the real value today is the skills.
```
