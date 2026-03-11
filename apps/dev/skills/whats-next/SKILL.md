---
name: whats-next
description: Tells you what to work on today. Synthesizes backlog items, grow observations, tasks, and GitHub issues into an opinionated action plan with prioritization and cross-referencing.
agent: dev
metadata:
  author: syner
  version: "0.3.0"
tools:
  - Read
  - Glob
  - Grep
  - Edit
  - Write
  - AskUserQuestion
  - Bash
---

# What's Next

Tells you what to work on today.

Reads from four sources, cross-references them, and produces an opinionated prioritized action plan.

## Arguments

| Flag | Description |
|------|-------------|
| `--backlog-only` | Only read backlog items (v0.2.0 behavior) |
| `--quick` | Skip GitHub API calls (faster) |
| `--domain X` | Filter to specific domain (bot, notes, dev) |

## Phase 1: Gather

Discover and read all sources. See `references/sources.md` for patterns.

### Required: Backlog
1. Find project root (directory containing `apps/` or `package.json`)
2. Discover backlog files: `.syner/vaults/**/backlog*.md` or `.syner/vaults/**/backlog/**/*.md`
3. If `--domain` specified, filter to that domain
4. If no backlog found, use `AskUserQuestion` to ask where it lives
5. Read all matching files

### Optional: Observations
1. Check if `.syner/ops/` exists
2. If exists, read `observations.md` from each subdirectory
3. Parse friction observations from last 7 days
4. If doesn't exist, note "No grow observations found" and continue

### Optional: Plans
1. Check if `.syner/plans/` exists
2. If exists, read `README.md` from each subdirectory
3. Parse plan status (in progress, pending, completed)
4. If doesn't exist, note "No plans found" and continue

### Optional: GitHub Issues
1. Skip if `--quick` or `--backlog-only` flag
2. Run: `gh issue list --state open --json number,title,labels,createdAt,assignees --limit 100`
3. If command fails, note "GitHub issues unavailable" and continue
4. Parse response into list of issues

## Phase 2: Cross-Reference

Connect related items across sources. See `references/cross-reference.md` for logic.

1. For each friction observation, find related backlog items and issues
2. For each backlog item, find related tasks and issues
3. For each task, find related issues
4. Build relationship map: which items describe the same underlying pattern
5. Identify orphaned items (friction with no backlog, backlog with no issue, etc.)

## Phase 3: Score

Calculate priority scores. See `references/scoring.md` for algorithm.

For each item/pattern:
1. Count friction frequency (last 7 days)
2. Check for related backlog/task/issue
3. Check issue labels and age
4. Check if affects orchestration or crosses domains
5. Sum weights to get score
6. Assign tier: P1 (>=15), P2 (8-14), P3 (<8)

## Phase 4: Synthesize

Generate opinionated recommendations. See `references/synthesis.md` for logic.

1. **First move**: Identify single highest-impact action
2. **Focus area**: Which domain needs most attention
3. **Decisions**: List issues with `needs-decision` label
4. **Patterns**: Group related items into themes

## Phase 5: Report

Write triage report. See `references/report-format.md` for template.

1. Create `.syner/reports/` directory if needed
2. Write report to `.syner/reports/triage-{date}.md`
3. Output brief summary to console

## Fallback Behavior

| Source | Condition | Fallback |
|--------|-----------|----------|
| Backlog | No files found | Ask user for location |
| Observations | No `.syner/ops/` | Skip, note in report |
| Plans | No `.syner/plans/` | Skip, note in report |
| GitHub | `gh` fails | Skip, suggest `/syner-gh-auth` |

If `--backlog-only` flag is set, skip phases related to observations, tasks, and GitHub. Only run backlog discovery, compare against code state (v0.2.0 behavior), and produce simplified output.

## Output Format

ALWAYS provide:

- **Report path**: Location of written triage report
- **First move**: Single highest-priority action with reasoning
- **Focus area**: Domain with most signals
- **Items**: Count by priority tier (P1, P2, P3)

## Boundaries

Validate against `/syner-boundaries`:
- **Context Before Action** — Read all sources before scoring
- **Proportional Loading** — `--quick` skips GitHub, `--domain` filters scope
- **Concrete Output** — Write report file, don't just print findings
- **Suggest, Don't Enforce** — Present priorities, user decides what to do
