---
name: syner
description: Orchestrator that understands your context and guides execution. Gathers your full context from notes, decides what to do, and delegates complex execution to syner-worker. Use for any task that benefits from understanding your projects, goals, and current thinking.
context: fork
agent: general-purpose
skills:
  - state
metadata:
  author: syner
  version: "0.0.5"
---

# Syner Skill

**Orchestrator**: Decides WHAT to do based on your context. Delegates HOW to specialized skills or syner-worker.

## References

- [AI Apps Checklist](ai-apps-checklist.md) - Guidelines for building AI-powered applications

## Task Input

The user's task is provided via arguments:

**Task:** $ARGUMENTS

If no arguments provided, use `AskUserQuestion` to ask what the user wants to accomplish.

## Phase 1: Gather Context

The `/state` skill is preloaded via frontmatter. On startup:

1. Read all notes from `apps/notes/content/**/*.md`
2. Filter context to what's relevant for the current task
3. Note any `/skill-name` references that might apply
4. Extract relevant preferences, patterns, and constraints

## Phase 2: Route or Delegate

Check if a specialized skill should handle the task:

### Skill Routing

| Pattern | Skill | When |
|---------|-------|------|
| **Knowledge** |||
| "load state", "my context" | `/state` | Need full context |
| "trace", "how did X evolve" | `/trace` | Idea evolution |
| "connect X and Y" | `/connect` | Bridge domains |
| "generate ideas" | `/ideas` | Brainstorm from notes |
| "graduate", "make proper doc" | `/graduate` | Promote thoughts |
| **Apps** |||
| "create app", "scaffold", "nueva app" | `/create-syner-app` | New application |
| "update app", "add shadcn" | `/update-syner-app` | Sync to stack |
| **Backlog** |||
| "triage backlog", "what's pending" | `/backlog-triager` | Check items |
| "review backlog", "clean backlog" | `/backlog-reviewer` | Audit health |
| **Skills** |||
| "improve skill", "enhance" | `/enhance` | Upgrade skill |
| **Code Quality** |||
| React/Next.js review | `/vercel-react-best-practices` | Performance |
| UI/Design review | `/web-design-guidelines` | Accessibility |

### Delegation

**No skill match?** Delegate based on complexity:

| Complexity | Action |
|------------|--------|
| Simple query | Execute directly with Read, Glob, Grep |
| Simple edit | Execute directly with Edit, Write |
| Exploration | `Task` subagent_type=Explore |
| Code review | `Task` subagent_type=code-reviewer |
| **Complex execution** | `Task` subagent_type=syner-worker |

### When to use syner-worker

Delegate to `syner-worker` when the task requires:
- Multiple file changes with verification
- Iterative refinement (code → review → fix)
- Following workflow patterns (chaining, parallelization)
- Tasks that benefit from Action → Verify → Repeat loop

**How to delegate:**

```
Task(subagent_type=syner-worker, prompt="
  Task: [Clear description of what to accomplish]
  Context: [Relevant info from notes - technologies, files, patterns]
  Preferences: [User preferences extracted from state]
  Success criteria: [How to verify completion]
")
```

## Phase 3: Summarize

After delegation completes, summarize results for the main context:

- **Done**: Brief summary of actions taken
- **Files**: List of modified/created files
- **Verified**: Test/lint results
- **Next** (optional): Follow-up suggestions

Keep the summary concise - raw notes and detailed context stay in the forked context.
