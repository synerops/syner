---
name: syner
description: Orchestrator for tasks that need your personal context. Routes to specialists or executes directly. Use when the task spans multiple areas, benefits from understanding your full situation, or you're unsure which skill to use. Loads context proportionally - simple requests get simple responses.
agent: general-purpose
tools: [Read, Glob, Grep, Task, Skill, AskUserQuestion, Write]
metadata:
  author: syner
  version: "0.3.1"
---

# Syner

This skill helps you accomplish tasks that requires more specific context than a general-purpose skill can provide.

See [README.md](README.md) for philosophy and examples.

## How this skill works

1. Understand intent and load context proportionally
2. Route to a specialist skill OR execute directly OR delegate to subagent

## When to Use this Skill

Use this skill when the user:

1. **Doesn't know which skill to use** - They have a task but aren't sure where to start. Syner figures out the right approach and routes accordingly.

2. **Needs multi-domain synthesis** - The task spans different areas (ideas + projects, notes + backlog, personal context + codebase). Syner connects the dots.

3. **Wants context-aware execution** - They want their notes, preferences, and personal context taken into account, not just generic assistance.

4. **Asks open-ended questions** - "What should I build next?", "What's blocking my progress?", "How do my ideas connect?" These require understanding their full situation.

5. **References their notes or vault** - Any request that would benefit from reading their vault, understanding their projects, or knowing their preferences.

6. **Needs to plan complex work** - Multiple findings or analysis results that should become a structured execution plan. See [plan.md](plan.md).

## Task

**Input:** $ARGUMENTS

If empty, use `AskUserQuestion` to ask what the user wants to accomplish.

## Step 0: Anchor to Project Root

Use `Glob` with pattern `apps/*/vaults/` to verify vault directories exist from the current working directory. All vault paths in subsequent steps are relative to this project root.

## Step 1: Understand & Load Context

Determine how much context this request needs:

| Scope | When | Action |
|-------|------|--------|
| **None** | Casual conversation, greetings | Respond directly |
| **App** | Task within a single app | Load that app's vault: `apps/{app}/vaults/**/*.md` |
| **Targeted** | Question about specific thing | Use Glob/Grep/Read for that area only |
| **Full** | Multi-domain synthesis, needs complete picture | Call `Skill(skill="syner-load-all")` |

### Vault Discovery

Each app can have its own vault. The filesystem IS the configuration:

```
apps/*/vaults/**/*.md    # All vaults across all apps
apps/{app}/vaults/**/*.md  # Single app's vaults
```

Local machine has more context than repo (vaults are gitignored by default).

### How to Decide

Ask yourself:
- Is this conversational? → None
- Is this about a specific app? → App (load that app's vault)
- Does this touch ONE specific file/topic? → Targeted (load only that)
- Does this need to connect or synthesize across apps? → Full

Don't pattern match on keywords. Understand the intent naturally.

### Examples (for reference, not rules)

- "hola" → None (conversational)
- "what's in my backlog?" → Targeted (load backlog notes only)
- "add dark mode to notes app" → App (load `apps/notes/vaults/`)
- "fix bot webhook" → App (load `apps/bot/vaults/`)
- "connect my ideas about X with project Y" → Full (multi-domain)
- "what should I build next?" → Full (needs complete context)

### When Full Context is Loaded

From your notes, extract:
- What's relevant to this specific task
- Your preferences that apply
- Any `/skill-name` references in your notes

## Step 2: Decide Fork & Route

### Decide Fork

| Case | Fork? |
|------|-------|
| Conversational, quick lookups, read-only queries | No - execute directly in current context |
| Multi-file, iterative, requires full context | Yes - use Task with subagent |

Only fork when the task genuinely requires isolation or parallel work.

### Planning Mode

When user requests planning or analysis produces multiple actionable findings:

1. Load [plan.md](plan.md) for the core planning logic
2. If operating on issues/PRs, also load `packages/github/plan.md` for implementation details
3. Evaluate, classify, and decide (plan / skip / clarify)
4. Output checklist with Target/Context/Action/Verify per item

This converts analysis output into atomic, executable items.

### Route to Specialist

| Skill | What it does |
|-------|--------------|
| `/syner-track-idea` | Track how an idea evolved over time |
| `/syner-find-links` | Find bridges between two different domains |
| `/syner-find-ideas` | Generate ideas from your knowledge |
| `/syner-grow-note` | Promote a thought into a proper document |
| `/create-syner-app` | Scaffold a new application |
| `/update-syner-app` | Update app to current stack |
| `/syner-backlog-triager` | Triage backlog against codebase |
| `/syner-backlog-reviewer` | Audit backlog health |
| `/syner-skill-reviewer` | Audit a skill for quality, safety, and conventions |

### Execute Directly

Read-only operations only:
- Read files, search code (Read, Glob, Grep)
- Quick questions about context

### Delegate to syner-worker

Complex execution that needs:
- Multiple file changes with verification
- Iterative refinement (code, review, fix)
- Action, Verify, Repeat loop

**Before delegating:**
1. Run `Glob("packages/*/SKILL.md")` to discover available packages
2. Read SKILL.md for packages relevant to the task
3. **Follow package prerequisites** - if the package says "check X before using", check it and include the setup commands if needed
4. **Gather task context** - don't make worker explore:
   - For PRs: run `git log`, `git diff --stat`, get exact commit messages
   - For code changes: read the relevant files first
5. Build exact command sequence and include everything in the worker prompt

```
Task(subagent_type="syner-worker", prompt="
  Task: [Specific action]

  Commands (exact sequence):
  1. [first command]
  2. [second command]
  ...

  Context (for reference):
  [git log output, PR body content, etc.]

  Success: [what to verify]
")
```

**Key principle:** Syner explores, checks state, builds exact commands. Worker just runs them.

### Delegate to syner-researcher

Research that needs web search or deep vault exploration:

```
Task(subagent_type="syner-researcher", prompt="
  Research: [topic]
")
```

## Step 3: Summarize

After completion:

- **Done**: What was accomplished
- **Files**: Modified/created
- **Verified**: Results (if applicable)
- **Next**: Suggestions (optional)

Keep it concise. This runs in a forked context - details stay here.

## Step 4: Write Audit (Conditional)

Write an audit file to `{project-root}/.syner/audits/YYYY-MM-DDTHH-MM-SS.md` **ONLY when:**
- Route was `worker` or `specialist`
- Files were modified/created

**Skip audit for:** conversational responses, read-only queries, quick lookups.

**Filename format:** `YYYY-MM-DDTHH-MM-SS.md` (e.g., `2026-03-02T14-32-05.md`)

**Template:**

```markdown
# Audit: {ISO timestamp}

## Request
{original user request}

## Routing
- Entry: /syner
- Context loaded: {none | targeted | full}
- Route: {direct | specialist:{skill-name} | worker}

## Tools Used
{list of tools and their purpose}

## Result
{success | failure} - {brief description}

## Duration
{approximate duration}
```

When writing audits, include failure details if applicable.

## References

- [README.md](README.md) - Philosophy and examples
- [skills-architecture.md](skills-architecture.md) - **Skill architecture** (symlinks, directories, where skills live)
- [plan.md](plan.md) - Planning mode for breaking down complex work
- [ai-apps-checklist.md](ai-apps-checklist.md) - When building AI apps
- PHILOSOPHY.md - Notes are personal, suggest don't enforce
