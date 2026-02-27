<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/cbf55457-a101-4547-9155-2fcc6ac08eaa" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/656eb187-0313-435b-bb44-e80f23924924" alt="Syner" height="96"/>
  </picture>
</p>

# Syner

A Personal Knowledge System

## Overview

Syner is an AI-powered personal knowledge system that understands how you think, follows your rules, and learns from your experiences to help you make better decisions.

Your notes become a living context that AI can read, trace, and connect - turning scattered thoughts into actionable insights.

See [PHILOSOPHY.md](PHILOSOPHY.md) for the design principles behind Syner.

## Memory

Markdown is the language of agents.

Create notes in `apps/notes/` with any structure you like. The project starts blank with no predefined notes.

Each folder is an organization of notes. To give Syner context about a folder, create an `index.md` file that describes what that folder contains and how to interpret its contents.

### The index.md Convention

When Syner reads a folder, it first looks for an `index.md` file. This file should explain:
- What this folder is about
- How notes in this folder are organized
- Any special conventions or terminology used
- How to interpret the content

This gives Syner the context it needs to understand your notes properly.

## Skills

### Orchestration

- `/syner` - Main orchestrator that understands your context and delegates to specialized skills or agents

### Knowledge

- `/state` - Load your full notes state
- `/syner-track-idea` - Track idea evolution (proactive + manual)

### Apps

- `/create-syner-app` - Scaffold new applications with the standard stack (Next.js + TypeScript + Tailwind + shadcn)
- `/update-syner-app` - Update existing apps to match current stack standards

### Backlog

- `/backlog-triager` - Triage backlog items against current codebase state
- `/backlog-reviewer` - Audit backlog health (stale items, duplicates, hidden TODOs)

### Skills Meta

- `/syner-enhance-skills` - Improve existing skills with best practices

## Agents

Agents handle complex execution with verification loops.

- **code-reviewer** - Reviews code for quality, security, and best practices. Detects code type and applies specialized reviews (React/Next.js, UI/accessibility)
- **syner-worker** - Executes tasks with verification using workflow patterns (chaining, parallelization, routing). Action → Verify → Repeat
