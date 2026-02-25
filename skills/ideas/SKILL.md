---
name: ideas
description: Generate startup ideas from your vault. Synthesize your unique knowledge, experiences, and observations into actionable startup or project ideas. Use when you want to explore what you could build based on your accumulated insights.
metadata:
  author: syner
  version: "1.0"
---

# Ideas Skill

## Purpose

Generate startup and project ideas by mining the user's notes for unique insights, frustrations, and opportunities.

## How to Read Notes

1. Find the project root (the directory containing `apps/`)
2. Use `Glob` tool with pattern `apps/notes/content/**/*.md` to discover all markdown files
3. **Important**: For each folder, check if an `index.md` exists and read it first - it provides context for interpreting that folder's contents
4. Use `Read` tool to load file contents

## Note Format Conventions

### Internal Links
Notes reference other notes using markdown links:
- `[display text](./relative-path.md)` - Link to another note
- Follow these links to understand relationships between notes

### External Documentation Links
Notes may reference external documentation, especially llms.txt endpoints:
- `[tool](https://example.com/docs/llms.txt)` - LLM-friendly documentation
- These indicate tools/technologies relevant to the note

### Skill References
Notes may reference skills using slash notation:
- `/skill-name` - Indicates a workflow or tool to use in that context

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
/ideas [optional: focus area or constraint]
```

Example: `/ideas developer-tools` or just `/ideas`
