---
name: graduate
description: Promote daily thoughts into real assets. Transform scattered daily notes, fleeting thoughts, and rough ideas into structured, actionable documents. Use when a thought has matured enough to become a proper article, plan, or reference document.
metadata:
  author: syner
  version: "1.0"
---

# Graduate Skill

## Purpose

Convert raw, daily thoughts into polished, structured documents that can be shared or acted upon.

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

1. Identify the thought/note to graduate (user provides or suggests from recent notes)
2. Locate `apps/notes/content/` from the project root
3. Use Glob to find relevant files, read `index.md` first in each folder for context
4. Analyze the raw material:
   - Core insight or thesis
   - Supporting observations
   - Related notes that add context
   - Gaps that need filling
5. Determine appropriate output format:
   - **Article**: For shareable insights
   - **Plan**: For actionable projects
   - **Reference**: For reusable knowledge
   - **Decision Doc**: For choices to be made
6. Draft the graduated document with internal links to related notes where relevant
7. Include external documentation links when referencing tools or technologies
8. Suggest placement and next actions

## Output Format

- **Source Material**: What's being graduated
- **Graduated Format**: Type of document created
- **Draft**: The structured document
- **Gaps Identified**: What's missing for completion
- **Suggested Next Steps**: How to finalize and use it

## Usage

```
/graduate [note title or topic]
```

Example: `/graduate my thoughts on async communication`
