---
name: review-plan
description: Present sprint epics for approval. Scans plan directories for unapproved epics, presents the human-readable README, and facilitates epic-level approval decisions. The gate between planning and autonomous execution.
metadata:
  author: syner
  version: "1.1.0"
  agent: dev
allowed-tools:
  - Read
  - Glob
  - Grep
  - Edit
---

# Review Plan

Present epics for approval in a loop. One epic at a time. After each decision (approve, refine, defer), automatically present the next unapproved epic. The loop ends when all epics are reviewed or the human says stop.

## Why This Exists

Approving tasks one by one is slow. In v0.1.0, it took 3 days to review and approve all tasks. The bottleneck was human-in-the-loop at every task.

This skill operates at the epic level. The human approves the "what and why" (README.md). The agent then owns the "how" (tasks) autonomously via `/execute-plan`.

## The Loop

```
Step 1: Discover epics
Step 2: Find next unapproved
Step 3: Present to human
Step 4: Facilitate decision
Step 5: Record decision + manage backlog
Step 6: → Back to Step 2 (next epic)
```

The loop breaks when:
- All epics are approved/deferred → report summary, suggest `/execute-plan`
- Human says "stop", "para", "pause" → stop and report progress

## Step 1: Discover Epics

Use `Glob` to find all epic AGENTS.md files:

```
Glob('{project_root}/.syner/plans/**/AGENTS.md')
```

For each AGENTS.md found, `Read` its frontmatter to check `status`. Skip files at the sprint root level (they're sprint-wide, not epic-specific).

## Step 2: Find Next Unapproved

Pick the first epic where AGENTS.md has `status: draft` or no status frontmatter. Epics are ordered by their directory number prefix (01, 02, 03, 04).

If all epics are approved or deferred, report the summary and suggest running `/execute-plan`. The loop ends here.

If no AGENTS.md files found, report "no epics to review."

## Step 3: Present to Human

`Read` the epic's README.md. Present it fully — the user may be on mobile and can't open files.

Cover these points, explained from zero (no codebase recall assumed):

- **What problem this solves** — what can't Syner do today that this enables?
- **What changes** — concrete deliveries, not abstract goals
- **What the risks are** — what could go wrong, what's the hardest part
- **Dependencies** — what must be done first, what this unblocks
- **Task count** — how many tasks, broken down by axis (SDK/App/Syner)

Don't review individual tasks. That's the agent's job during execution. The human is deciding whether the epic's direction is right.

## Step 4: Facilitate Decision

After presenting and discussing, use `AskUserQuestion` to get an explicit decision. Never infer approval from context — plan-mode approval, "looks good", or similar signals are NOT epic approval.

```
AskUserQuestion: "What's your decision on this epic?"
Options: Approved, Refining, Defer
```

Then act on the explicit answer:

| Decision | What happens |
|----------|-------------|
| **Approved** | `Edit` AGENTS.md: add `status: approved` and `approved_at: {date}` in frontmatter. Add approval to Decisions section. |
| **Refining** | Check if the README/tasks have stale scope from prior decisions (deferred APIs, renamed tasks, changed dependencies). If so, proactively offer to update them and re-present — don't wait for the human to identify each stale section. `Edit` when aligned. Keep `status: draft`. After refinement, re-present the same epic (don't advance). |
| **Defer** | Leave as draft. Add deferral reason to Decisions section. Advance to next epic. |

## Step 5: Record Decision + Manage Backlog

### Decisions

Append to the AGENTS.md Decisions section (create if absent):

```markdown
## Decisions

- **[2026-03-25]** Approved. [brief rationale or conditions noted by the human]
```

Decisions are append-only. They form the audit trail for why epics were approved, deferred, or refined.

### Backlog

During review, deferred items and refinement discussions often surface work that isn't a task yet. These go in the AGENTS.md Backlog section (create if absent):

```markdown
## Backlog

- [item] — [brief context of why it was deferred and what would trigger picking it up]
```

Backlog items are things that:
- Came up during review but are out of scope for this epic
- Were explicitly deferred with a reason
- Are dependencies on future work (e.g., "full Thread API when toAiMessages isn't enough")

Backlog is not a dumping ground — each item needs context so a future session can evaluate whether to promote it to a task.

## Step 6: Next Epic

After recording the decision, go back to Step 2. Find the next unapproved epic and present it. Don't wait for the human to invoke `/review-plan` again.

After approval, briefly tell the human what happens next before moving on:
- Tasks will be self-reviewed and executed via `/execute-plan`
- PRs created for code changes — human merges
- AGENTS.md updated as tasks progress
- README.md gets "What Was Delivered" on completion

Then immediately present the next epic.

## Edge Cases

- **Epic has no tasks/ directory** — flag as incomplete. The epic has direction (README) but no work breakdown. Suggest creating tasks before approving.
- **Epic has tasks but no AGENTS.md** — the task table needs to exist for tracking. Suggest creating AGENTS.md with the task table.
- **Stale in-progress epic** — if AGENTS.md shows `status: in-progress` but no tasks have changed recently, surface this. Ask if the human wants to reset or continue.
- **Human interrupts with unrelated topic** — pause the loop, handle the topic, then offer to resume review where you left off.
