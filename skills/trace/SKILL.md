---
name: trace
description: See how an idea evolved over months. Track the evolution of a specific idea, concept, or project through your notes over time. Use when you want to understand how your thinking has changed or find the origin of a current belief.
metadata:
  author: syner
  version: "1.0"
---

# Trace Skill

## Purpose

Reconstruct the evolution of a specific idea or concept across time through the user's notes.

## How to Read Notes

1. Find the project root (the directory containing `apps/`)
2. Use `Glob` tool with pattern `apps/notes/content/**/*.md` to discover all markdown files
3. **Important**: For each folder, check if an `index.md` exists and read it first - it provides context for interpreting that folder's contents
4. Use `Read` tool to load file contents
5. Use `ls -la` or `stat` on files to get modification timestamps for chronological ordering

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

1. Ask the user for the idea/concept to trace (if not provided)
2. Locate `apps/notes/content/` from the project root
3. Use Glob to find all `.md` files, then use `ls -la` or `stat` to get file modification dates
4. For each folder, read `index.md` first if it exists
5. Search all notes for mentions of the concept using Grep or by reading files
6. Order findings chronologically using file modification timestamps
7. For each mention, capture:
   - Date/timestamp (from file metadata)
   - Context in which it appeared
   - The specific take or perspective at that time
   - Any connections made to other ideas
   - Internal links as evidence of when ideas became connected
8. Identify key inflection points where thinking shifted
9. Consider links between notes as evidence of evolution and connection
10. Map the evolution narrative

## Output Format

Present a timeline view:
- **Origin**: First appearance and initial framing
- **Evolution Points**: Key moments where the idea changed
- **Influences**: What caused shifts in thinking
- **Current State**: Latest understanding
- **Trajectory**: Where the idea seems to be heading

## Usage

```
/trace [concept or idea to trace]
```

Example: `/trace building in public`
