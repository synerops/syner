---
name: find-ideas
description: Orchestrate the ideas system. Mine vaults for ideas, analyze maturity, and route to the right skill or agent. The entry point for idea discovery that connects find-links, grow-note, track-idea, and cross-app routing.
metadata:
  author: syner
  version: "0.3.0"
tools: [Glob, Read]
---

# Find Ideas

> Ideas System Orchestrator — Discovers ideas and routes them to the right destination.

You don't just find ideas — you analyze them, assess their maturity, and connect them to the right next step. An idea might need structuring (`grow-note`), evolution tracking (`track-idea`), cross-domain bridging (`find-links`), or routing to another agent entirely.

Not generic ideas — ideas that leverage the user's specific knowledge, frustrations, and unfair advantages.

## Purpose

Orchestrate the full ideas lifecycle:

1. **Discover** — Mine vaults for idea seeds
2. **Analyze** — Assess maturity and type
3. **Route** — Connect to the right next step

### What You Look For

- Problems they've complained about
- Inefficiencies they've observed
- "Someone should build..." moments
- Unique knowledge combinations
- Underserved communities they belong to
- Workflows they've hacked together

### Where You Route

| Maturity/Type | Destination |
|---------------|-------------|
| Scattered across notes | `grow-note` |
| Evolved over time | `track-idea` |
| Bridges domains | `find-links` |
| Technical/ecosystem | `dev` agent |
| Component/UI | `design` agent |
| Integration | `bot` agent |
| Early seed | Let simmer |

## Ideas Scope Integration

**Queries:** `Seeks`, `Signals`, `Ignores` from agent lead
**Purpose:** Filter what to search, detect patterns, route to other agents
**Benefit:** In `notes` searches startups/life ideas, in `dev` searches skills/features

## Step 0: Load Context

1. Detect current app from working directory
2. Read `agents/{app}.md` → extract `## Ideas Scope`
3. Use Seeks/Signals/Ignores to filter discovery

**Fallback:** If no Ideas Scope found, run in legacy mode:
- Search all patterns without domain filtering
- Skip cross-app routing (no Ignores to consult)
- Note in output: "Running without Ideas Scope context"

## Process

### 1. Discover Vaults

```
apps/*/vaults/**/*.md
```

### 2. Read with Context

For each folder, read `index.md` first to understand folder context.

### 3. Extract Idea Seeds

Look for:
- **Pain points** — What frustrates them?
- **Expertise gaps** — What do they know that others don't?
- **Community access** — What groups do they belong to?
- **Workflow hacks** — What have they built for themselves?
- **External links** — Follow llms.txt or docs for technical context

### 4. Cross-Reference

Match seeds against:
- User's skills and interests
- Available time and resources
- Market gaps they've noted

### 5. Generate Ideas

For each viable idea, assess their unfair advantage.

## Output

For each idea:

```markdown
### [Idea Name]

**What:** One-line description
**Origin:** Which notes led here
**Why You:** Your unfair advantage
**Risk:** Main assumption to test

**→ Suggested Next Step:**
[Dynamic based on analysis - see Next Step Logic]
```

## Next Step Logic

Analyze each idea and suggest based on signals:

| Signal Detected | Suggested Action |
|-----------------|------------------|
| Scattered across multiple notes | `/grow-note` to structure |
| Revisited/evolved over time (>3 mentions) | `/track-idea` to trace evolution |
| Connects two distinct domains | `/find-links` to bridge |
| Technical improvement to syner | Route to `dev` agent |
| Component/UI idea | Route to `design` agent |
| Integration/webhook idea | Route to `bot` agent |
| Mature with clear validation | Direct action item (create issue, build MVP) |
| Early seed, unclear | "Let it simmer - revisit in 1 week" |

## Output Examples

**Mature idea with material:**
```markdown
### CLI for markdown notes

**What:** Terminal-first PKM that syncs with Obsidian
**Origin:** daily/2026-03-01.md, projects/tools.md, ideas/cli.md
**Why You:** 3 years using Obsidian + CLI tools daily
**Risk:** Market already crowded with similar tools

**→ Suggested Next Step:**
You've written about this in 3 different places.
Run `/grow-note` to gather and structure into a project plan.
```

**Evolving idea:**
```markdown
### AI agents with memory

**What:** Persistent memory between sessions
**Origin:** First mentioned 2026-01-15, revisited 5 times
**Why You:** Building syner agents daily
**Risk:** Complexity of reliable state management

**→ Suggested Next Step:**
Your thinking on this has evolved over 2 months.
Run `/track-idea ai-memory` to see how your perspective shifted.
```

**Cross-domain idea:**
```markdown
### Design system for AI-generated UIs

**What:** Components that LLMs can compose reliably
**Origin:** Notes in design/ and dev/ vaults
**Why You:** Experience in both design systems and AI
**Risk:** Requires deep understanding of both domains

**→ Suggested Next Step:**
This bridges your work in design and dev.
Run `/find-links design dev` to surface deeper connections.
```

**Different domain idea:**
```markdown
### Webhook handler for Linear

**What:** Sync Linear issues with syner backlog
**Origin:** dev/integrations.md
**Why You:** Using Linear for project management
**Risk:** Maintenance burden of external integrations

**→ Routing:**
This is an integration idea → belongs to `bot` agent.
Run in bot context or mention @bot to develop further.
```

**Early seed:**
```markdown
### Something with WebRTC

**What:** Unclear yet - just a signal
**Origin:** Single mention in daily/2026-03-08.md
**Why You:** Not established
**Risk:** Too early to assess

**→ Suggested Next Step:**
Early seed - not enough signal yet.
Let it simmer. If it resurfaces, run `/track-idea webrtc`.
```

## Usage

```
/find-ideas [optional: focus area or constraint]
```

Examples:
- `/find-ideas` — scan everything
- `/find-ideas developer-tools` — focus on dev tools
- `/find-ideas low-effort` — ideas that need minimal time

## Boundaries

This skill operates within `/syner-boundaries`. Key constraints:

| Boundary | Application |
|----------|-------------|
| Notes Are Context | Read for patterns, not structured extraction |
| Concrete Output | Deliver actual ideas with reasoning, not "areas to explore" |
| Proportional Loading | If focus area given, scope to relevant notes |

**Self-check:** Each idea should trace back to specific notes. If you can't cite the origin, the idea is generic — discard it.
