---
name: execute-plan
description: Autonomous epic executor. Picks up approved epics and runs their tasks in dependency order — reviewing, refining, implementing, and verifying each task without waiting for per-task approval. Creates PRs for code changes, updates tracking docs after each task.
metadata:
  author: syner
  version: "1.0.0"
  agent: dev
allowed-tools:
  - Read
  - Glob
  - Grep
  - Edit
  - Write
  - Bash
  - Skill
skills:
  - github-create-pr
---

# Execute Plan

Pick up approved epics and run their tasks autonomously. One task at a time, but the loop doesn't pause between tasks.

## Why This Exists

The human approved the epic's direction via `/review-plan`. Now the agent owns execution. Tasks can be rewritten, refined, and self-approved — the human reviews at epic boundaries (PRs and final README), not at every task.

## The Loop

### Step 1: Find Epic

Use `Glob` to discover epics:

```
Glob('{project_root}/.syner/plans/**/AGENTS.md')
```

`Read` each AGENTS.md frontmatter. Find the first epic where `status: approved` and at least one task has `status != done`.

If the epic's status is `approved` (not yet `in-progress`), `Edit` it to `status: in-progress`.

### Step 2: Scan Tasks

```
Glob('{epic}/tasks/*.md')
```

`Read` each task's frontmatter. Build the dependency graph. Find tasks where:
- `status: draft` (not yet started)
- All entries in `depends_on` reference tasks with `status: done`

Pick the first executable task by ID order.

If no tasks are executable but some remain, report what's blocking (which dependencies aren't done) and stop the loop.

### Step 3: Self-Review Task

`Read` the full task. Evaluate:

- **Inputs clear?** Critical files listed, acceptance criteria testable?
- **Still relevant?** Does this task still make sense given tasks already completed?
- **Right-scoped?** Completable in one session? If too big, split it and log the decision.

If the task needs changes, `Edit` it. Add an entry to its `## Decisions` section:

```markdown
## Decisions

- **[2026-03-25]** Rewritten: [what changed and why]
```

Then `Edit` frontmatter: `status: approved`.

### Step 4: Execute Task

Load context proportionally — don't over-read:
- `Read` critical files listed in the task
- `Read` AGENTS.md of affected packages/apps (only the ones the task touches)
- If the task modifies a file, `Read` it first

Implement using Edit, Write, and Bash as needed.

Run verification checks based on what the task produces:

| Deliverable type | How to verify |
|-----------------|---------------|
| TypeScript code | `bun run build` passes, exports exist, types compile |
| Markdown (agent/skill) | File exists, frontmatter valid, references point to real files |
| Multi-package changes | Build across affected packages, no circular deps |
| New directories | Structure matches spec, `package.json` valid if applicable |

If verification fails, fix and retry. If it fails twice, stop — add a note to the task explaining what failed and why.

If the task produced code changes, create a PR via `/github-create-pr`. Include:
- Task reference (epic + task ID)
- What was implemented
- Verification results

`Edit` task frontmatter: `status: done`.

### Step 5: Update Tracking

`Edit` the epic's AGENTS.md task table — update the task's status column.

### Step 6: Loop or Complete

**More executable tasks?** → Back to Step 2.

**All tasks done?**
- `Edit` README.md: add a `## What Was Delivered` section summarizing what was built, with PR links.
- `Edit` AGENTS.md frontmatter: `status: done`.

**Tasks remaining but all blocked?**
- Report: which tasks are pending, what dependencies they're waiting on.
- Stop the loop. The human may need to unblock (merge PRs, make decisions).

## Boundaries

- **Self-approve tasks** within approved epics. Log every approval and rewrite.
- **Cannot change epic scope.** README.md goals and Definition of Done are the human's domain. If a task conflicts with the epic's DoD, stop and ask.
- **Cannot merge PRs.** Create them. The human merges.
- **Stop on double failure.** If a task fails verification twice, stop the loop and report.
- **One task at a time.** Don't batch-execute. Finish one, update tracking, then pick the next.

## Dry Run

If the user says "dry run" or "show me what you'd do":

1. Find the epic (Step 1)
2. Scan all tasks (Step 2)
3. Self-review each executable task (Step 3) — describe changes you'd make
4. For each task, describe what you'd implement and how you'd verify it
5. Don't make any changes

This lets the human validate the agent's understanding before real execution.

## Edge Cases

- **No approved epics** — report "no approved epics, run /review-plan first."
- **Task already in-progress without changes** — may be stale from a crashed session. Ask the human: resume or reset to draft?
- **Circular dependencies** — report the cycle, don't attempt execution.
- **Task depends on task in another epic** — cross-epic dependencies are valid. Check the other epic's task status.
