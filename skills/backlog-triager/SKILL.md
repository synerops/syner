---
name: backlog-triager
description: Health audit for the backlog itself. Detects stale items, duplicates, dependency chains, and implicit items buried inside notes that should be tracked separately. Use to keep the backlog clean and actionable.
metadata:
  author: syner
  version: "1.0"
---

# Backlog Triager

Audit backlog health — find what's stale, duplicated, tangled, or hiding.

## Phase 1: Context

1. Find project root (directory containing `apps/` or `package.json`)
2. Use `Glob` from project root with pattern `apps/notes/content/backlog/**/*.md` to discover backlog files
3. If no backlog folder found, use `AskUserQuestion` to ask where the backlog lives
4. For the backlog folder, use `Read` to load `index.md` first if it exists (contains folder-level context)
5. Use `Read` to load all backlog item files
6. Get the current date (use `Bash` with `date +%Y-%m-%d`) for staleness checks

## Phase 2: Action

Run these checks across all backlog items:

### Stale detection

- Flag items whose "Last reviewed" timestamp is older than 30 days
- Flag items referencing files/paths that no longer exist in the codebase (verify with `Glob` or `Grep`)
- Flag items marked **Open** with no activity or progress indicators

### Duplicate detection

- Compare item titles and descriptions across all backlog notes
- Group items that describe the same underlying problem with different wording
- Recommend which duplicate to keep (prefer the one with more detail)

### Dependency mapping

- Identify items that explicitly or implicitly block other items (e.g. "depends on #3", "after X is done")
- Build a simple dependency list: `A blocks B`, `C depends on D`
- Flag circular dependencies

### Implicit item discovery

- Scan the **detail sections** of each backlog note for:
  - Embedded TODOs or action items not tracked in the status table
  - Open questions that deserve their own item
  - Side-observations or ideas mentioned in passing
- List each as a candidate new backlog item

## Phase 3: Verify

1. Present a **Health Report** with all findings
2. For each finding, propose a concrete action:
   - Stale → re-review or close
   - Duplicate → merge into one item
   - Dependency → reorder or note the chain
   - Implicit → promote to explicit backlog item
3. Ask the user which actions to apply
4. Apply approved changes using `Edit`
5. Update the `> Last reviewed: YYYY-MM-DD` timestamp on every modified backlog note

> After triaging, run the `backlog-reviewer` skill (found via `Glob` pattern `skills/backlog-reviewer/SKILL.md`) to validate surviving items against the actual codebase.

## Output Format

ALWAYS provide:

- **Scanned**: Number of backlog notes / items audited
- **Stale**: Count of stale items
- **Duplicates**: Count of duplicate groups found
- **Dependencies**: Count of dependency chains
- **Implicit**: Count of hidden items discovered
- **Health**: Overall assessment (Healthy / Needs attention / Overdue for cleanup)
- **Actions applied**: List of changes made (merges, closures, promotions)
- **Remaining**: Items presented to user but not yet actioned
