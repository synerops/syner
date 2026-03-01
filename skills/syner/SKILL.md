---
name: syner
description: Orchestrator for tasks that need your personal context. Routes to specialists or executes directly. Use when the task spans multiple areas, benefits from understanding your full situation, or you're unsure which skill to use. Loads context proportionally - simple requests get simple responses.
context: fork
agent: general-purpose
tools: Read, Glob, Grep, Task, Skill, AskUserQuestion
metadata:
  author: syner
  version: "0.2.0"
---

# Syner

This skill helps you accomplish tasks that requires more specific context than a general-purpose skill can provide.

See [README.md](README.md) for philosophy and examples.

## How this skill works

1. Understand intent and load context proportionally
2. Route to a specialist skill OR execute directly OR delegate to syner-worker

## When to Use this Skill

Use this skill when the user:

1. **Doesn't know which skill to use** - They have a task but aren't sure where to start. Syner figures out the right approach and routes accordingly.

2. **Needs multi-domain synthesis** - The task spans different areas (ideas + projects, notes + backlog, personal context + codebase). Syner connects the dots.

3. **Wants context-aware execution** - They want their notes, preferences, and personal context taken into account, not just generic assistance.

4. **Asks open-ended questions** - "What should I build next?", "What's blocking my progress?", "How do my ideas connect?" These require understanding their full situation.

5. **References their notes or vault** - Any request that would benefit from reading their vault, understanding their projects, or knowing their preferences.

## Task

**Input:** $ARGUMENTS

If empty, use `AskUserQuestion` to ask what the user wants to accomplish.

## Step 1: Understand & Load Context

Determine how much context this request needs:

| Scope | When | Action |
|-------|------|--------|
| **None** | Casual conversation, greetings | Respond directly |
| **Targeted internal** | Question about specific vault area, single-project task | Use Glob/Grep/Read for that area |
| **Targeted external** | Needs package context (GitHub, Vercel, etc.) | Call `Task(subagent_type=syner-context, prompt="Get context for: <task>")` |
| **Full** | Multi-domain synthesis, needs complete picture | Call `Skill(skill="syner-load-all")` + `Task(subagent_type=syner-context)` |

### How to Decide

Ask yourself:
- Is this conversational? → None
- Does this touch ONE vault area? → Targeted internal (load only that)
- Does this need external context (PRs, deployments, etc.)? → Targeted external
- Does this need to connect or synthesize across areas? → Full

Don't pattern match on keywords. Understand the intent naturally.

### Examples (for reference, not rules)

- "hola" → None (conversational)
- "what's in my backlog?" → Targeted internal (load backlog notes only)
- "add dark mode to notes app" → Targeted internal (load apps/notes/)
- "what PRs need my attention?" → Targeted external (syner-context for GitHub)
- "is my app deployed?" → Targeted external (syner-context for Vercel)
- "connect my ideas about X with project Y" → Full (multi-domain)
- "what should I build next?" → Full (needs complete context)
- "help me ship this feature" → Full (vault + GitHub + Vercel)

### When Full Context is Loaded

From your notes, extract:
- What's relevant to this specific task
- Your preferences that apply
- Any `/skill-name` references in your notes

From external context (syner-context):
- Relevant PRs, issues, deployments
- Blocking items or dependencies

## Step 2: Route or Execute

### Route to Specialist

| Skill | What it does |
|-------|--------------|
| `/syner-track-idea` | Track how an idea evolved over time |
| `/syner-find-links` | Find bridges between two different domains |
| `/syner-find-ideas` | Generate ideas from your knowledge |
| `/syner-grow-note` | Promote a thought into a proper document |
| `/create-syner-app` | Scaffold a new application |
| `/update-syner-app` | Update app to current stack |
| `/backlog-triager` | Triage backlog against codebase |
| `/backlog-reviewer` | Audit backlog health |
| `/syner-skill-reviewer` | Audit a skill for quality, safety, and conventions |
| `/syner-researcher` | Research a topic |

### Execute Directly

Read-only operations only:
- Read files, search code (Read, Glob, Grep)
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
