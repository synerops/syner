---
name: syner-find-links
description: Bridge two domains you've been circling. Find unexpected connections between two different areas, topics, or projects in your notes. Use when you sense a link but can't articulate it, or to discover non-obvious relationships.
metadata:
  author: syner
  version: "1.1"
---

# Syner Find Links

## Purpose

Discover and articulate connections between two seemingly separate domains in the user's knowledge base.

## How to Read Notes

Follow conventions in `skills/syner/note-conventions.md`.
Use `Read` tool to load it before processing notes.

## Instructions

1. Accept two domains/topics from the user
2. Locate `apps/notes/vaults/syner/` from the project root
3. Use Glob to find all `.md` files recursively
4. For each folder, read `index.md` first if it exists to understand folder context
5. Analyze notes related to each domain
6. Look for connection patterns:
   - Explicit internal links between notes (strongest evidence of connection)
   - Shared concepts or vocabulary
   - Similar problems or challenges
   - Complementary insights
   - Temporal correlations (explored around same time)
   - Referenced by each other directly or indirectly
   - Common underlying principles
7. Generate bridge hypotheses
8. Rank connections by strength and novelty (explicit links rank highest)

## Output Format

- **Domain A Summary**: Key themes from first area
- **Domain B Summary**: Key themes from second area
- **Bridges Found**: Specific connections with evidence
- **Synthesis**: A unified framing that encompasses both
- **Implications**: What these connections suggest for action

## Usage

```
/syner-find-links [domain A] [domain B]
```

Example: `/syner-find-links meditation productivity-systems`
