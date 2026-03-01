---
name: backlog-triager
description: Triage backlog items against the current codebase. Compares each item to actual code state, marks as fixed/partial/open, assigns priorities, and updates the backlog note. Use when starting a session without a task, or to check what's pending.
metadata:
  author: syner
  version: "1.1"
allowed-tools:
  - Bash(bun run agent-github exec -- gh issue create *)
  - Bash(bun run agent-github exec -- gh issue comment *)
---

# Backlog Triager

Triage backlog items against the current state of the codebase.

## Phase 1: Context

1. Find project root (directory containing `apps/` or `package.json`)
2. Use `Glob` from project root with pattern `apps/notes/vaults/syner/backlog/**/*.md` to discover backlog files
3. If no backlog folder found, use `AskUserQuestion` to ask where the backlog lives
4. For the backlog folder, use `Read` to load `index.md` first if it exists (contains folder-level context)
5. Use `Read` to load all backlog item files

## Phase 2: Action

For each backlog file, for each item:

1. Read the relevant codebase files the item refers to
2. Compare the item's description against what actually exists
3. Classify:
   - **Fixed** — the issue described no longer exists in the codebase
   - **Partial** — some progress made but not fully resolved
   - **Open** — still present as described
4. Assign priority:
   - **P1** — high impact, easy fix, or blocking other work
   - **P2** — meaningful improvement, moderate effort
   - **P3** — nice to have, low urgency, or depends on other items
5. Write a prioritized action plan (ordered by priority, then effort)

## Phase 3: Verify

1. Update the backlog note with:
   - A status table (item, status, priority)
   - A `> Last reviewed: YYYY-MM-DD` timestamp
   - A "Prioritized next actions" section
2. Present summary to user

## Phase 4: Create Issues

1. Present list of items that would become GitHub issues
2. Use `AskUserQuestion` to confirm creation
3. Use `AskUserQuestion` to ask which coding agent to assign (default: claude)
4. For each approved item:
   a. Create issue with `bun run agent-github exec -- gh issue create --assignee <agent>`
   b. Capture the issue number from output
   c. Add a contextual comment mentioning the agent:
      - Reference the specific issue context
      - Give the agent initiative to investigate and act
      - Example: `@<agent> This issue affects X. Please investigate and open a PR when ready.`
5. When creating PRs related to issues:
   - Assign PRs to syner (synerops) for review
   - Reference the issue number in the PR description

## Output Format

ALWAYS provide:

- **Reviewed**: Number of items triaged
- **Status**: X fixed, Y partial, Z open
- **Top action**: The single highest-priority next step
