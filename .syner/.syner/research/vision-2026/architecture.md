# Syner Architecture Vision

Date: 2026-03-12

## Core Principle

**syner** is not a process. It emerges from the collaboration of autonomous apps following a shared protocol.

## The Stack

| App | What it is | Replaceable? | Features |
|---|---|---|---|
| **osprotocol** | The contract | No | context -> action -> verification, system interfaces, agent-agnostic interfaces, defines SKILL.md format, defines how agents communicate |
| **syner.dev** | SDK/framework | Yes | Runtime (Vercel Functions + Workflows + Queues), exposes `/agent/xxx`, sandbox, AI SDK, BYOK (keys + Vercel account), `npx create-syner-agent`, each agent is its own client, receives self-development requests |
| **syner.md** | Context engineer | Yes | Vaults, markdown, converts skills, distributes context, storage on Vercel Blob + KV/Postgres per user |
| **syner.bot** | Conversational interface | Yes | Chat-sdk, message routing, platform adapters (Slack, Discord, etc), one channel = one agent skill, decides routing |
| **syner.design** | Visual output | Yes | UI, assets, design systems |
| **syner.app** | Presentation layer | Yes | What the user touches, Next.js on Vercel |
| **syner** | Emergent property | N/A | Not a process — emerges from collaboration |

## Cross-cutting Concerns

- Every app has **SKILL.md**, every app **generates**, every app follows **osprotocol**, every app is a **client of syner.dev**
- **Self-development**: agents request improvements to syner.dev
- **Each person installs their own syner** (BYOK Vercel account)
- **Discovery via `/agent/xxx`**, no centralized registry
- **Vendor lock-in contained in syner.dev**, osprotocol is agnostic

## Third-party Escalation Ladder

1. **Skill agent** — SKILL.md + function
2. **Tool agent** — composes skills, has state
3. **App agent** — full citizen

## Objectives (ordered)

1. Have notes -> syner.md
2. People use syner on Slack -> syner.bot
3. Syner self-improves -> self-development via syner.dev
4. Team builds internal apps from Slack (slides, "udemy")
5. People don't code to create agents, Vercel handles it
