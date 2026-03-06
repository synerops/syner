---
name: syner-grow-note
description: Promote daily thoughts into real assets. Transform scattered daily notes, fleeting thoughts, and rough ideas into structured, actionable documents. Use when a thought has matured enough to become a proper article, plan, or reference document.
metadata:
  author: syner
  version: "0.1.1"
tools:
  - Glob
  - Read
  - Write
  - AskUserQuestion
---

# Syner Grow Note

## Purpose

Convert raw, daily thoughts into polished, structured documents that can be shared or acted upon.

## How to Read Notes

Follow conventions in `skills/syner/note-conventions.md`.
Use `Read` tool to load it before processing notes.

## Instructions

### Step 0: Anchor to project root

Find the directory containing both `apps/` and (optionally) `package.json`.
All subsequent paths are relative to this root.

1. Identify the thought/note to graduate:
   - If the user provided a note title or topic as an argument, use that
   - If no argument was provided, use AskUserQuestion to ask: "Which note or thought would you like to graduate? (provide a title, topic, or path)"
2. Discover all vaults using pattern `apps/*/vaults/**/*.md`
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
/syner-grow-note [note title or topic]
```

Example: `/syner-grow-note my thoughts on async communication`
