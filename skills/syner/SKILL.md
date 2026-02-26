---
name: syner
description: Your interface to your own knowledge. Reads all your notes, understands your context, and routes to the right skill or executes directly. Use when you don't know which skill to use, or when the task benefits from understanding your full situation.
context: fork
agent: general-purpose
skills:
  - state
metadata:
  author: syner
  version: "0.1.0"
---

# Syner

The entry point when you don't know which skill to use.

See [README.md](README.md) for philosophy and examples.

## What I Do

1. Load your context (all notes via `/state`)
2. Understand your intent
3. Route to a specialist skill OR execute directly OR delegate to syner-worker

## Task

**Input:** $ARGUMENTS

If empty, use `AskUserQuestion` to ask what the user wants to accomplish.

## Step 1: Context

The `/state` skill is preloaded. From your notes, extract:
- What's relevant to this specific task
- Your preferences that apply
- Any `/skill-name` references in your notes

## Step 2: Route or Execute

### Route to Specialist

| Signal | Skill |
|--------|-------|
| idea evolution, history | `/syner-arc` |
| connect two topics | `/connect` |
| generate ideas | `/ideas` |
| promote to proper doc | `/graduate` |
| create app, scaffold | `/create-syner-app` |
| update app stack | `/update-syner-app` |
| triage backlog | `/backlog-triager` |
| backlog health | `/backlog-reviewer` |
| improve a skill | `/enhance` |
| research topic, learn about | `/syner-researcher` |

### Execute Directly

Simple tasks that don't need delegation:
- Read files, search code (Read, Glob, Grep)
- Small edits (Edit, Write)
- Quick questions about context

### Delegate to syner-worker

Complex execution that needs:
- Multiple file changes with verification
- Iterative refinement (code, review, fix)
- Action, Verify, Repeat loop

```
Task(subagent_type=syner-worker, prompt="
  Task: [What to accomplish]
  Context: [From notes - tech, patterns, files]
  Preferences: [User preferences]
  Success: [How to verify]
")
```

## Step 3: Summarize

After completion:

- **Done**: What was accomplished
- **Files**: Modified/created
- **Verified**: Results (if applicable)
- **Next**: Suggestions (optional)

Keep it concise. This runs in a forked context - details stay here.

## References

- [PHILOSOPHY.md](../../PHILOSOPHY.md) - Notes are personal, suggest don't enforce
- [ai-apps-checklist.md](ai-apps-checklist.md) - When building AI apps
