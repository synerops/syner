---
name: syner-find-ideas
description: Generate startup ideas from your vault. Synthesize your unique knowledge, experiences, and observations into actionable startup or project ideas. Use when you want to explore what you could build based on your accumulated insights.
metadata:
  author: syner
  version: "1.1"
---

# Syner Find Ideas

## Purpose

Generate startup and project ideas by mining the user's notes for unique insights, frustrations, and opportunities.

## How to Read Notes

Follow conventions in `skills/syner/note-conventions.md`.
Use `Read` tool to load it before processing notes.

## Instructions

1. Locate `apps/notes/content/` from the project root
2. Use Glob to find all `.md` files recursively
3. For each folder, read `index.md` first if it exists to understand folder context
4. Follow external documentation links (especially llms.txt) to understand technical context
5. Analyze all notes and extract idea seeds:
   - Problems the user has complained about
   - Inefficiencies they've observed
   - "Someone should build..." moments
   - Unique knowledge combinations
   - Underserved communities they belong to
   - Workflows they've hacked together
6. Cross-reference with user's skills and interests
7. Generate ideas that leverage their unfair advantages
8. Score ideas on feasibility and founder-market fit

## Output Format

For each idea:
- **Idea**: One-line description
- **Origin**: Which notes/insights led here
- **Why You**: Your unfair advantage
- **First Step**: Smallest possible validation
- **Risk**: Main assumption to test

## Usage

```
/syner-find-ideas [optional: focus area or constraint]
```

Example: `/syner-find-ideas developer-tools` or just `/syner-find-ideas`
