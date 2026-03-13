# osprotocol — Protocol Positioning

Date: 2026-03-12
Source: Research on agent protocol landscape

## The Protocol Stack (as of March 2026)

```
Internet Layer     →  ANP  (W3C DID identity, decentralized discovery)
Coordination       →  A2A  (Google, task delegation, Agent Cards)
                      AGNTCY (Cisco/LF, fleet observability, identity)
Context Layer      →  MCP  (Anthropic/LF, tools, resources, prompts)
Execution/Runtime  →  osprotocol  ← UNCLAIMED LAYER
```

## Key Finding

No existing protocol covers the execution runtime layer. This is the layer that defines:
- What happens inside the agent when it executes
- Pre-conditions before an action
- The action itself
- Post-verification that the action succeeded
- Rollback or escalation on failure

A2A explicitly calls this "opaque". MCP never touches it.

## Relationship to Existing Protocols

| Protocol | Relationship |
|---|---|
| **MCP** | MCP defines what tools exist. osprotocol defines the lifecycle of *using* those tools. Composes on top. |
| **A2A** | A2A delivers a task. osprotocol defines what "task execution" looks like internally. Fills A2A's opaque box. |
| **AGNTCY** | AGNTCY provides fleet-level observability. osprotocol provides per-agent execution contracts that AGNTCY can observe. |
| **ANP** | ANP handles internet-scale discovery. osprotocol operates below — once an agent is found and a task delegated, osprotocol governs execution. |

## What osprotocol Would Define

1. **Context interface** — standardized way for an agent to declare what context it has loaded before acting
2. **Action interface** — standardized description of what an agent is about to do, with pre-conditions and expected effects
3. **Verification interface** — standardized assertion that an action produced the intended outcome, with rollback or escalation on failure
4. **Agent-agnostic** — not tied to Claude, GPT, LangChain, or any framework

## Industry Validation

Analysis from 2025-2026 consistently names verification, state management, and authorization as the unsolved problems of the agent ecosystem. The execution runtime layer is the next frontier.

## Open Question

Should osprotocol define its interfaces in terms of MCP (easier adoption) or be completely independent (purer, harder adoption)?

## Protocols Absorbed / Dead

- **ACP** (IBM BeeAI) — merged into A2A, September 2025. No longer independent.

## Sources

See agent-protocols-landscape.md for full research with citations.
