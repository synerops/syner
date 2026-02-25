---
name: connect
description: Bridge two domains you've been circling. Find unexpected connections between two different areas, topics, or projects in your notes. Use when you sense a link but can't articulate it, or to discover non-obvious relationships.
metadata:
  author: syner
  version: "1.0"
---

# Connect Skill

## Purpose

Discover and articulate connections between two seemingly separate domains in the user's knowledge base.

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

1. Accept two domains/topics from the user
2. Locate `apps/notes/content/` from the project root
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
/connect [domain A] [domain B]
```

Example: `/connect meditation productivity-systems`
