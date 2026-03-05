---
name: syner-load-all
description: Load your full life + work state. Discovers and reads all notes across all app vaults, building a unified context of your knowledge, projects, goals, and current thinking. Use when starting a new session or when you need the AI to understand your complete situation.
metadata:
  author: syner
  version: "0.2.0"
tools: [Glob, Read]
---

# Syner Load All

## Purpose

Build a comprehensive understanding of the user's current state by analyzing all their notes across all vaults.

## Instructions

### Step 1: Discover All Vaults

Use Glob to find all vaults across all apps:

```
apps/*/vaults/**/*.md
```

This discovers notes in:
- `apps/notes/vaults/` - knowledge, ideas, writings
- `apps/bot/vaults/` - bot context and config
- `apps/dev/vaults/` - development notes
- Any other app with vaults

### Step 2: Group by App

Organize discovered notes by their app:

```
notes/
  vaults/syner/backlog.md
  vaults/syner/ideas.md
bot/
  vaults/bot/index.md
dev/
  vaults/dev/index.md
```

### Step 3: Read with Context

For each vault:
1. Check for and read `index.md` first - it provides context for that vault
2. Read remaining files
3. Follow internal links to map relationships

### Step 4: Synthesize

Extract and synthesize:
- Active projects and their status
- Current goals (short-term and long-term)
- Recurring themes and interests
- Open questions and uncertainties
- Key relationships and collaborators
- Recent learnings and insights

Highlight tensions or contradictions. Note what areas have recent activity vs dormant.

## Output Format

Provide a structured summary with sections:
- **Active Focus**: What the user is currently working on
- **Background Projects**: Ongoing but not primary focus
- **Key Themes**: Recurring ideas and interests
- **Open Loops**: Unresolved questions or decisions
- **Context Window**: Recent vs historical activity patterns

> **Philosophy reminder:** Notes are personal and free-form. Skills read for context, not for data extraction.
