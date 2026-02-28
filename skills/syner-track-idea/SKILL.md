---
name: syner-track-idea
description: Track idea evolution - proactively surfaces evolved ideas worth revisiting, or traces a specific concept manually.
context: fork
metadata:
  author: syner
  version: "2.1"
---

# Syner-Track-Idea Skill

## Purpose

Two modes:
1. **Proactive Mode** (no argument): Detect ideas that have evolved significantly and surface them for review
2. **Manual Mode** (with argument): Trace the evolution of a specific idea through time

## How to Read Notes

Follow conventions in `skills/syner/note-conventions.md`.
Use `Read` tool to load it before processing notes.

Use `Bash` tool with `git log --oneline --follow -- [file]` to get commit history per file.

## Instructions

### Proactive Mode (`/syner-track-idea` without arguments)

1. Locate `apps/notes/content/` from the project root
2. Use `Glob` tool to find all `.md` files
3. For each file, use `Bash` tool with `git log --oneline --follow -- [file]` to get commit count and dates
4. Identify candidates using these criteria (in order of priority):
   - **High activity**: Files with >5 commits across different months
   - **Dormant but significant**: Files with >3 commits that haven't been touched in >30 days
   - **High link density**: Files with >3 internal links (indicates connected ideas)
5. Rank candidates by how many criteria they meet
6. Present top 1-3 ideas with:
   - Note name/path
   - One-line "why now" explanation
   - Commit activity summary
7. Ask user if they want a full trace of any idea

### Manual Mode (`/syner-track-idea [concept]`)

1. Locate `apps/notes/content/` from the project root
2. Use `Glob` tool to find all `.md` files
3. Use `Grep` tool to search all notes for mentions of the concept
4. For each file with matches, use `Bash` tool with `git log --oneline --follow -- [file]`
5. Order findings chronologically using git commit dates
6. For each mention, capture:
   - Date (from git history)
   - Context in which it appeared
   - The specific take or perspective at that time
   - Any connections made to other ideas (internal links)
7. Identify key inflection points where thinking shifted
8. Map the evolution narrative

## Output Format

### Proactive Mode Output

ALWAYS use this structure:

```
## Ideas con evolución significativa

1. **[note-name]** - [X commits across Y months, last edit Z days ago]
   → [One-line insight: why this idea evolved]

2. **[note-name]** - [activity summary]
   → [One-line insight]

¿Quieres que trace alguna? Responde con el nombre.
```

### Manual Mode Output

ALWAYS use this structure:

- **Origin**: First appearance and initial framing
- **Evolution Points**: Key moments where the idea changed
- **Influences**: What caused shifts in thinking
- **Current State**: Latest understanding
- **Trajectory**: Where the idea seems to be heading

## Usage

```
/syner-track-idea                    # Proactive: detect evolved ideas
/syner-track-idea building in public # Manual: trace specific concept
```
