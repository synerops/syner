---
url: "https://www.anthropic.com/engineering/building-effective-agents"
title: "Building Effective Agents"
source: "anthropic.com"
author: "Erik Schluntz, Barry Zhang"
date_saved: "2026-03-24"
date_published: "2024-12-20"
tags: [agents, orchestration, patterns, anthropic]
fetchable: false
---

# Building Effective Agents

> The argument for why your orchestrator should route to simple skills instead of building one massive agent — from the people who make the model.

## Why This Matters to You

Syner already follows the core thesis of this article: skills over monoliths, orchestration over complexity. But the article gives you vocabulary and validation from Anthropic's side. The "workflows vs agents" distinction maps directly to how `/syner` routes — some tasks are predefined skill chains (workflows), others let the model decide the path (true agents). The tension is knowing when to use which, and syner's current design leans heavily toward workflows. This article is the reference for when to let go and let the agent drive.

## Key Takeaways

- **Augmented LLMs are the atomic unit** — retrieval + tools + memory compose into everything else. Syner's skills are exactly this: focused capabilities with tool access and vault context.
- **Workflows vs agents is the key design decision** — Prompt chaining and routing are workflows (predictable). True agents loop until done (flexible). `/syner` currently acts as a router (workflow), but background agents need the loop pattern.
- **Start simple, add complexity only when it fails** — Resist the urge to build orchestrator-workers when a single skill with good context would do. Every skill in `apps/*/skills/` should justify its existence.
- **The orchestrator-workers pattern** — One LLM dispatches to specialized workers. This is literally `/syner` → `/find-ideas`, `/grow-note`, etc. Anthropic validates this architecture.
- **Tools are the leverage point** — The quality of an agent depends on its tools, not its prompt sophistication. Syner's `@syner/vercel` (Bash, Fetch) and vault access are the tools that make skills useful.

## Threads

- Builds on: PHILOSOPHY.md's "Skills, not monoliths" — same thesis, different angle
- Tension with: Syner's current routing is mostly deterministic (`/syner` picks the skill). The article suggests some problems need the model to decide its own path dynamically.

## Links

- [Original](https://www.anthropic.com/engineering/building-effective-agents)
