# bot

Operational knowledge for the integration bridge.

## intent → search pattern

When syner needs bot context, route by intent:

| intent | strategy |
|--------|----------|
| How does bot work? | Grep "architecture", "how it works" |
| What integrations exist? | Grep "webhook", "integration", "GitHub", "Slack" |
| How to configure X? | Grep "{integration} setup", "environment", "config" |
| What can bot do? | Grep "capabilities", "features", "endpoints" |
| Deployment info | Grep "vercel", "deploy", "env vars" |
| Public messaging | Grep "landing", "homepage", "public" |

## navigation

| tool | when to use |
|------|-------------|
| Glob `**/*.md` | Discover all available context |
| Grep | Find specific integration, config, or capability |
| Read | Direct access once you know the path |

## principles

- **No folder structure exposed** — this file is public, vault contents are private
- **Intent-first routing** — describe what you need, grep finds where it lives
- **Prefix `_` signals system context** — not user notes, operational knowledge
