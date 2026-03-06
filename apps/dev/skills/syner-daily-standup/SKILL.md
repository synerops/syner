---
name: syner-daily-standup
description: Generate daily standup reports from pre-gathered GitHub data. Use when asked for "standup", "daily status", or on scheduled CI runs. Data is in .syner/context/daily-standup/.
metadata:
  author: syner
  version: "0.1.3"
tools: [Read, Write, Glob]
---

# Daily Standup

Generate a standup report from pre-gathered GitHub data.

## Step 1: Read the data

Find the project root (directory containing `apps/` or `package.json`), then use it as the base for all paths below.

```
.syner/context/daily-standup/
├── today.txt           # Today's date
├── issues-open.json    # Open issues assigned to me
├── prs-open.json       # My open PRs
├── prs-review.json     # PRs waiting for my review
├── issues-closed.json  # Recently closed issues
└── prs-merged.json     # Recently merged PRs
```

Read these files to understand current state and recent activity.

## Step 2: Write the report

Write to `{root}/reports/standup-{date}.md`:

```markdown
# Standup YYYY-MM-DD

## Yesterday
- [Completed items from closed issues and merged PRs]

## Today
- [Priority items from open issues/PRs]
- [PRs waiting for review]

## Blockers
- [Any blockers, or "None"]
```

Keep it under 15 lines. If nothing notable, write "✅ All clear".

## Criteria

- **Stale**: Flag items with 7+ days without activity
- **Exclude**: Skip items with labels `blocked` or `waiting-external`
- **Prioritize**: What can be unblocked today
