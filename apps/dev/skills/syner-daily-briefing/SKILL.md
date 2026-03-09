---
name: syner-daily-briefing
description: Generate daily briefing from pre-gathered GitHub data. Your single dashboard showing PRs ready for review, issues needing decisions, and completed work. Use when asked for "briefing", "daily status", or on scheduled CI runs.
agent: dev
metadata:
  author: syner
  version: "0.1.0"
tools: [Read, Write, Glob]
---

# Daily Briefing

> Part of **Dev** — the Ecosystem Builder mutation of Syner.

Generate a briefing report from pre-gathered GitHub data. This is your daily dashboard - the one place to see everything that needs attention.

This is an operations skill. Run daily or on schedule to stay informed.

## Step 1: Read the data

```
.syner/context/daily-briefing/
├── today.txt                    # Today's date
├── prs-skill-review.json        # PRs from skill-review (ready for review)
├── prs-open.json                # All open PRs with labels
├── issues-needs-decision.json   # Issues requiring human decision
├── prs-merged.json              # Recently merged PRs
└── issues-closed.json           # Recently closed issues
```

Read these files to understand current state and recent activity.

## Step 2: Write the report

Write to `.syner/reports/briefing-{date}.md`:

```markdown
# Daily Briefing YYYY-MM-DD

## Ready for Review
- PR #180: Add path anchor to 12 skills
- PR #181: Fix version format in 3 skills

## Needs Decision
- Issue #183: [B4] Input Handling — 2 skills affected
  → A) Use AskUserQuestion  B) Fail with error  C) Use default

## Completed Yesterday
- Merged: PR #178, PR #179
- Closed: Issue #175
```

## Format Rules

- **Ready for Review**: PRs with `skill-review` label or waiting for review
- **Needs Decision**: Issues with `needs-decision` label. Include options if available.
- **Completed Yesterday**: Merged PRs and closed issues from last 24h

If a section is empty, show "None" or omit entirely.

If everything is clear: "✅ All clear - nothing pending"

Keep it under 20 lines. This is a dashboard, not a novel.

## Boundaries

Validate against `/syner-boundaries`:
- **Concrete Output** — Write actual report file
- **Proportional Loading** — Read only the pre-gathered data files
- **Observable Work** — Report location is predictable
