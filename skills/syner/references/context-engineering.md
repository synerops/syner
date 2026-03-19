# Context Engineering — Detailed Rationale

Reference doc for the compact Context Engineering section in `agents/syner.md`. This contains the full explanations, pattern mappings, and design reasoning that were externalized to keep syner.md as a decision interface.

## Workflow-Based Context Strategies

The same 5 Anthropic patterns from Self-Provisioning (03/01), applied to **context assembly**:

| Pattern | Context gathering use | Example |
|---------|----------------------|---------|
| **Routing** | Classify intent → load only that domain's guides | A `packages/github` task loads `packages/github/AGENTS.md`, not all packages |
| **Parallelization** | Probe multiple independent sources simultaneously → merge results | Vaults + issues + package guides loaded in parallel for a cross-cutting task |
| **Orchestrator-workers** | Invoke app/package agents to gather context from their domains. They know their territory. You synthesize | Ask the slack agent "what's your current state?" before touching packages/slack |
| **Chaining** | Scope is ambiguous → multi-step resolution | Step 1: classify domain. Step 2: load domain guides. Step 3: targeted code reads |
| **Evaluator-optimizer** | After assembling context, check for gaps/contradictions. Loop back for targeted fetches until coherent | Context says auth uses PATs, but code uses App tokens → fetch auth guide to resolve |

## Agents as Context Sources

Agents own their territory. Invoke them not just to execute but to **answer questions**:

| Question | Context source |
|----------|---------------|
| What skills does this app have? | Ask the app's agent |
| What are a package's constraints? | Read its AGENTS.md, or invoke its agent |
| What's the operational state? | ops agent knows friction, decisions, tracking |
| Cross-domain synthesis needed? | Invoke multiple agents in parallel, each returns domain summary |

**Why apps matter as sources:** Each app holds domain-specific knowledge that no project-level scan can provide — its skill catalog, its UI conventions, its content pipeline state, its current friction points. The vaults app knows PKM patterns. The bot app knows integration contracts. The dev app knows ecosystem tooling. General context tells you the monorepo structure; an app agent tells you what's actually happening inside its territory.

**Contract:** When invoked for context, agents return compressed summaries — not raw file dumps. Workers compress, orchestrator synthesizes.

**Enforcement model:** This is a behavioral convention enforced by instructions in syner.md. Protocol-level enforcement (ContextRequest with typed fields) is deferred to plan 03/04.

## Pre-loaded vs Just-in-time

| Type | What | Examples |
|------|------|---------|
| Pre-loaded | Guides, identity, territory contracts | AGENTS.md, SKILL.md, active plans |
| Just-in-time | Source code, configs, specific vault notes | Files discovered during work |

Rule of thumb: guides and identity are pre-loaded. Code and specific notes are just-in-time.

## Compression Principles

- Each source returns a summary (1,000-2,000 tokens), not a dump
- Workers compress, orchestrator synthesizes
- Never concatenate — always merge
- Compression happens at every boundary: agent → orchestrator, vault → skill, plan → executor

## ContextRequest Shape (Aspirational)

When spawning Syner instances, specify context needs declaratively:

```
SpawnOptions {
  contextRequest: {
    level: 0 | 1 | 2 | 3,
    territories: ['github'],
    topics: ['auth', 'tokens'],
  }
}
```

The runtime resolves the request into concrete file reads at spawn time. The `level` field maps directly to the context tree hierarchy.

Not yet implemented. Documents intent for when spawn infrastructure exists. Shape should align with Plan 03/04 (Spawn Options Simplify).

## App-Scale Discipline

Apps follow the same context engineering discipline at their own scale:

- Each app has domain-specific knowledge general context can't provide
- An app agent answers questions no project-level scan can
- This is WHY agents-as-context-sources matters at the architectural level
- The vaults app knows PKM patterns, the bot app knows integration contracts, the dev app knows ecosystem tooling

## Design Decision: Compact syner.md

syner.md should be a **decision interface**, not a documentation file:

- Decision tables + pattern names + worked examples > verbose explanations
- Vercel achieved 80% compression by distilling AGENTS.md to essentials
- Detailed rationale lives here (reference doc), loaded on-demand when needed
- syner.md has the "what to do" — this doc has the "why"
