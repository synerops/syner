---
name: track-idea
description: Track idea evolution - proactively surfaces evolved ideas worth revisiting, or traces a specific concept manually.
context: fork
tools: [Bash, Glob, Grep, Read]
metadata:
  author: syner
  version: "0.3.0"
---

# Track Idea

You track how ideas evolve. Some thoughts get revisited, refined, contradicted. You surface which ones have grown — and how.

## Purpose

Two modes:

| Mode | Trigger | What it does |
|------|---------|--------------|
| **Proactive** | No argument | Detect ideas that evolved significantly, surface for review |
| **Manual** | With argument | Trace a specific concept through time |

## Ideas Scope Integration

**Queries:** `Seeks` from agent lead
**Purpose:** Know what type of evolution to track in this domain
**Benefit:** In `notes` tracks startup/life idea evolution, in `dev` tracks skill/feature evolution

## Proactive Mode

### When

Use when:
- Starting a session and want to see what's matured
- Periodic review of evolving thinking
- Looking for what deserves attention

### Process

1. **Discover vaults:** `apps/*/vaults/**/*.md`
2. **Read context:** `index.md` first per folder
3. **Check git history:** `git log --oneline --follow -- [file]`
4. **Identify candidates:**

| Criterion | Why it matters |
|-----------|----------------|
| >5 commits across different months | Sustained attention |
| >3 commits, dormant >30 days | Matured, ready for review |
| >3 internal links | Connected idea |

5. **Rank by criteria met**
6. **Present top 1-3**

### Output

```markdown
## Ideas Worth Revisiting

1. **[note-name]** — [X commits across Y months, last edit Z days ago]
   → [One-line insight: why this evolved]

2. **[note-name]** — [activity summary]
   → [One-line insight]

Want me to trace any of these? Reply with the name.
```

## Manual Mode

### When

Use when:
- User wants to see how a specific idea changed
- Tracing the evolution of a concept
- Understanding shifts in thinking

### Process

1. **Discover vaults:** `apps/*/vaults/**/*.md`
2. **Grep for concept** across all notes
3. **Get git history** for each file with matches
4. **Order chronologically** by commit date
5. **For each mention, capture:**
   - Date
   - Context
   - The take at that time
   - Connections made (internal links)
6. **Identify inflection points** where thinking shifted
7. **Map the evolution**

### Output

```markdown
## Evolution: [concept]

### Origin
[First appearance, initial framing]

### Evolution Points

**[Date]** — [file]
[The take at this point]

**[Date]** — [file]
[How it shifted]

...

### Influences
[What caused shifts in thinking]

### Current State
[Latest understanding]

### Trajectory
[Where the idea seems headed]
```

## Usage

```
/track-idea                    # Proactive: what evolved?
/track-idea building in public # Manual: trace this concept
```

## Boundaries

This skill operates within `/syner-boundaries`. Key constraints:

| Boundary | Application |
|----------|-------------|
| Self-Verification | Verify git history exists before claiming evolution |
| Observable Work | Show commit counts and dates as evidence |
| Concrete Output | Name specific evolution points, not "it seems to have changed" |
| Graceful Failure | If no git history, say so and offer alternatives |

**Self-check:** Every evolution point should cite a commit or date. If you can't verify the timeline, flag uncertainty.
