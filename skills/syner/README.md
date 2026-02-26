# Syner

**Orchestrator agent that understands your context and guides execution.**

> The word `syner` is derived from `synergy`. Syner works together with you and its workers to achieve your goals.

Syner is the entry point when you don't know which skill to use. It reads your notes, understands your context, and either handles your request directly or routes it to a specialized skill.

## What I Actually Do

1. **Load your context** - Via `/state`, I read all your notes to understand your projects, goals, current thinking, and preferences
2. **Understand your intent** - I figure out what you're trying to accomplish
3. **Route or execute** - I either handle it myself (simple tasks) or delegate to the right skill/agent

## When to Use Me

- You have a task but don't know which skill applies
- You want the AI to understand your full situation before acting
- You're starting a session and want everything in context
- The task touches multiple areas of your knowledge or codebase

## When NOT to Use Me

- You know exactly which skill you need (use it directly)
- Simple commands that don't need context (just ask Claude)
- You want fast, focused execution without context overhead

## How I Work

I run in a **forked context**. This means:
- I load heavy context (all your notes) without polluting the main conversation
- Results get summarized back to you
- The detailed context stays isolated

## My Relationship with Other Skills

I'm the **orchestrator**. Other skills are **specialists**.

| Skill | What it does | When I route to it |
|-------|--------------|-------------------|
| `/state` | Builds context from notes | Preloaded automatically |
| `/trace` | Tracks idea evolution | "How did X evolve?" |
| `/connect` | Finds bridges between domains | "Connect X and Y" |
| `/ideas` | Generates ideas from your knowledge | "What could I build?" |
| `/create-syner-app` | Scaffolds new apps | "Create an app" |
| `/backlog-triager` | Triages backlog against code | "What's pending?" |

## My Relationship with syner-worker

For complex execution that needs:
- Multiple file changes
- Iterative refinement (code, review, fix)
- Verification loops (lint, test, check)

I delegate to `syner-worker`. I provide the WHAT and context, it handles the HOW.

## Philosophy

From `PHILOSOPHY.md`:

- **Notes are personal** - I read organically, not parsing structured fields
- **Suggest, don't enforce** - I recommend, you decide
- **Execute with verification** - Action, Verify, Repeat

## Example

```
/syner add dark mode to the notes app
```

What happens:
1. I load your full context (notes, projects, preferences)
2. I identify this is a code task in `apps/notes`
3. I check your preferences (maybe you prefer Tailwind dark: variants)
4. I delegate to `syner-worker` with full context
5. Worker executes, verifies, reports back
6. I summarize to you

## What I'm Not

- I'm not a search engine (use Grep/Glob directly)
- I'm not a file reader (use Read directly)
- I'm not a general chatbot (just talk to Claude)
- I'm not magic - I work from what's in your notes

## The Point

Your notes are your external brain. I'm the interface that makes them actionable. The more you write, the more I understand. The more I understand, the better I can help.
