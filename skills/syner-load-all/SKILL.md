---
name: syner-load-all
description: Load your full life + work state. Reads all notes in apps/notes/content/ and builds a unified context of your knowledge, projects, goals, and current thinking. Use when starting a new session or when you need the AI to understand your complete situation.
metadata:
  author: syner
  version: "1.1"
---

# Syner Load All

## Purpose

Build a comprehensive understanding of the user's current state by analyzing all their notes.

## How to Read Notes

Follow conventions in `skills/syner/note-conventions.md`.
Use `Read` tool to load it before processing notes.

## Instructions

1. Locate `apps/notes/content/` from the project root
2. Use Glob to find all `.md` files recursively
3. For each folder encountered, check for and read `index.md` first to understand folder context
4. Read all files using the Read tool
5. Extract and follow internal links between notes to map relationships
6. Identify and extract:
   - Active projects and their status
   - Current goals (short-term and long-term)
   - Recurring themes and interests
   - Open questions and uncertainties
   - Key relationships and collaborators
   - Recent learnings and insights
7. Synthesize into a structured context summary
8. Highlight any tensions or contradictions found
9. Note what areas have recent activity vs dormant areas

## Output Format

Provide a structured summary with sections:
- **Active Focus**: What the user is currently working on
- **Background Projects**: Ongoing but not primary focus
- **Key Themes**: Recurring ideas and interests
- **Open Loops**: Unresolved questions or decisions
- **Context Window**: Recent vs historical activity patterns

> **Philosophy reminder:** Notes are personal and free-form. Skills read for context, not for data extraction.
