# Vision 2026 — Research

Research session: 2026-03-12

## Files

| File | What |
|---|---|
| [architecture.md](architecture.md) | The full stack table, cross-cutting concerns, escalation ladder, objectives |
| [osprotocol-positioning.md](osprotocol-positioning.md) | Where osprotocol sits relative to MCP, A2A, ANP, AGNTCY |
| [agent-protocols-landscape.md](agent-protocols-landscape.md) | Full mapping of every agent protocol (March 2026) |
| [vercel-agent-runtime.md](vercel-agent-runtime.md) | Vercel primitives evaluation, limits, bugs, costs |
| [self-development-patterns.md](self-development-patterns.md) | Self-improving systems: what works, what fails, safety rules |
| [syner-apps.md](syner-apps.md) | Role definition for each app in the stack |
| [decisions.md](decisions.md) | Decision log: question, tension, resolution, rationale |
| [adoption-nextjs.md](adoption-nextjs.md) | Adoption path for existing Next.js apps — the npm install pitch |

## Use Cases

osprotocol narrado paso a paso con escenarios reales del ecosistema syner.

| File | Escenario | Patrón demostrado |
|---|---|---|
| [use-cases/slides-from-slack.md](use-cases/slides-from-slack.md) | Usuario pide slides desde Slack → syner.bot → syner.md → syner.design | Chain of verified handoffs |
| [use-cases/self-development.md](use-cases/self-development.md) | Un skill falla en reuniones largas y se mejora a sí mismo | Gated self-improvement |
| [use-cases/third-party-nextjs.md](use-cases/third-party-nextjs.md) | Developer integra su app Next.js como agente en 5 min | Progressive adoption with contract guarantees |
| [use-cases/cross-instance.md](use-cases/cross-instance.md) | El syner de Ana pide design review al syner de Ronny | Sovereign execution with public contracts |

## Key Findings

1. **osprotocol occupies an unclaimed layer** — execution/verification runtime that no existing protocol covers
2. **Vercel is sufficient for v1** but has hard limits that validate syner.dev being replaceable
3. **Self-development works in production** (Devin builds Devin) with one non-negotiable: the evaluator cannot be the agent being evaluated
4. **syner is not a process** — it's an emergent property of apps collaborating under osprotocol
