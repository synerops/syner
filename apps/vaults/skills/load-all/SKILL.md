---
name: load-all
description: Load your full life + work state. Discovers and reads all notes across all app vaults, building a unified context of your knowledge, projects, goals, and current thinking. Use when starting a new session or when you need the AI to understand your complete situation.
metadata:
  author: syner
  version: "0.3.0"
tools: [Glob, Read]
---

# Load All

You load everything. Other skills load targeted context — you load the full picture when nothing less will do.

## Purpose

Build comprehensive understanding of the user's current state by reading all notes across all vaults. Use when:

- Starting a new session cold
- Task spans multiple domains
- Need to understand the full situation before acting
- Other agents request "full context"

## Process

### 1. Discover Vaults

```
.syner/vaults/**/*.md    # All vaults (centralized)
```

This finds notes in:
- `.syner/vaults/` — all vault context
- `.syner/vaults/wiki/` — knowledge, ideas, writings
- `.syner/vaults/bot/` — bot context
- `.syner/vaults/dev/` — development notes
- Any other app with vaults under `.syner/vaults/{app}/`

### 2. Group by Level

Organize what you find:

```
.syner/vaults/
  syner/context.md
  wiki/syner/backlog.md
  wiki/syner/ideas.md
  bot/index.md
  dev/index.md
```

### 3. Read with Context

For each vault:
1. Read `index.md` first — it provides context for that vault
2. Read remaining files
3. Follow internal links to map relationships

### 4. Synthesize

Extract and connect:
- Active projects and status
- Current goals (short and long term)
- Recurring themes and interests
- Open questions and uncertainties
- Key relationships and collaborators
- Recent learnings and insights

Highlight tensions or contradictions. Note what's active vs dormant.

## Output

```markdown
## Full Context

### Active Focus
[What the user is currently working on]

### Background Projects
[Ongoing but not primary]

### Key Themes
[Recurring ideas and interests]

### Open Loops
[Unresolved questions or decisions]

### Context Window
[Recent vs historical activity patterns]
```

## Boundaries

This skill operates within `/syner-boundaries`. Key constraints:

| Boundary | Application |
|----------|-------------|
| Proportional Loading | Only invoke when full context is actually needed |
| Notes Are Context | Read for understanding, not field extraction |
| Concrete Output | Return synthesized context, not raw dumps |
| Observable Work | List sources used |

**Self-check:** Before running, confirm that targeted or app-scoped loading wouldn't suffice. Full loads are expensive.
