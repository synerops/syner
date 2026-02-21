---
name: route
description: >
  Classify input and delegate to a single specialist. Use when the task needs
  one specific handler — not multiple. Syner's simplest orchestration pattern.
---

# /route — Routing Workflow

Classify the request, pick the right specialist, delegate.

## Pattern

```
input → classify() → route key → delegate to workflow → output
```

## How to Execute

1. **Classify**: Analyze the input — what kind of work is this?
   - Read the request carefully
   - Determine the domain (code, design, protocol, docs, infra)
   - Return a route key

2. **Delegate**: Route to the matching specialist
   - Use sub-agents: `ecosystem` (extensions), `osprotocol` (protocol)
   - Use tools directly if no specialist needed
   - One specialist per request — if you need multiple, use `/orchestrate`

3. **Return**: Pass the specialist's output back as-is

## Route Map

| Route Key | Specialist | When |
|-----------|-----------|------|
| `ecosystem` | ecosystem agent | GitHub, Vercel, Upstash, extensions |
| `osprotocol` | osprotocol agent | Protocol schema, interfaces, domains |
| `code` | Claude (direct) | Implementation, debugging, refactoring |
| `docs` | `/docs` skill | Documentation review, creation |

## Rules

- ONE specialist per route — never fan out
- If classification is ambiguous, ask the user
- Default to `code` when no specialist matches
- Never execute the work yourself — always delegate
