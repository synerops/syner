---
name: syner-daily-briefing
description: Daily coach that tells you what to do first. Analyzes GitHub activity, detects patterns, and gives opinionated recommendations. Use when asked for "briefing", "daily status", or on scheduled CI runs.
agent: dev
metadata:
  author: syner
  version: "0.2.0"
tools: [Read, Write, Glob]
---

# Daily Briefing

Your daily coach. Not just what's pending — what to do first and why.

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

Read all files. Parse JSON. Calculate:

- **Age**: days since created/opened
- **Size**: additions + deletions → S (<50), M (50-200), L (>200)
- **Velocity**: items closed in last 7 days

## Step 2: Analyze

### Priority Order

Prioritize in this order:
1. Has `needs-decision` label (human input required)
2. Blocks other work (mentioned in other items)
3. Has `skill-review` label (ready for review)
4. Age > 7 days (going stale)
5. Size S (quick win)

Apply judgment when criteria conflict or context suggests otherwise.

### Pattern Detection

Look for:

- **Stale items**: >7 days without movement
- **Velocity trend**: this week vs last week (from merged/closed dates)
- **Ratio**: skills vs apps vs infra work
- **Bot ratio**: % of PRs from synerbot vs human

## Step 3: Write the report

Write to `.syner/reports/briefing-{date}.md`:

```markdown
# Daily Briefing YYYY-MM-DD

## Your first move

**[Title]** — [age] days, [size] lines
→ [Why this first + estimated time]

## Decisions blocking work

**Issue #N: [Title]**
→ [Options if available, or "needs triage"]

## PRs ready for review

| PR | Title | Days | Size |
|----|-------|------|------|
| #N | Title | X | S/M/L |

[If any PR > 7 days: "⚠️ PR #N has been open for X days. Blocked or avoiding it?"]

## Patterns this week

- X PRs merged, Y open
- Z issues closed
- [Velocity trend: ↑ improving, → stable, ↓ slowing]
- [If bot ratio > 80%: "🤖 Bot did 80% of the work. Nice."]

## Completed yesterday

- Merged: #N, #M, ...
- Closed: #X, #Y, ...

---
[Summary line: "✅ X PRs ready | Y decisions needed | Z completed yesterday"]
```

## Step 4: Handle empty state

If nothing is pending:

```markdown
# Daily Briefing YYYY-MM-DD

## ✅ All clear

No PRs waiting. No decisions pending.

## Completed yesterday

- Merged: #N, #M, ...
- Closed: #X, #Y, ...

## Patterns this week

- X items completed
- Velocity: [trend]
- [Insight about the week]

---
Inbox zero. Ship something new or take a break.
```

## Format Rules

- Keep it scannable — bullets over paragraphs
- Be opinionated — "do this first" not "consider doing this"
- Ask uncomfortable questions — "why has this been open for 2 weeks?"
- Estimate time — helps decide what to tackle
- Max 30 lines — this is a briefing, not a novel

## Local Testing

```bash
# 1. Gather real data
mkdir -p .syner/context/daily-briefing
date +%Y-%m-%d > .syner/context/daily-briefing/today.txt
gh pr list --state open --label "skill-review" --json number,title,createdAt,author,additions,deletions > .syner/context/daily-briefing/prs-skill-review.json
gh pr list --state open --json number,title,createdAt,author,labels,additions,deletions > .syner/context/daily-briefing/prs-open.json
gh issue list --state open --label "needs-decision" --json number,title,createdAt,assignees > .syner/context/daily-briefing/issues-needs-decision.json
gh pr list --state merged --json number,title,mergedAt,author --limit 20 > .syner/context/daily-briefing/prs-merged.json
gh issue list --state closed --json number,title,closedAt --limit 20 > .syner/context/daily-briefing/issues-closed.json

# 2. Run skill
claude "/syner-daily-briefing"

# 3. Check output
cat .syner/reports/briefing-$(date +%Y-%m-%d).md
```

## Boundaries

Validate against `/syner-boundaries`:
- **Concrete Output** — Write actual report file
- **Proportional Loading** — Read only the pre-gathered data files
- **Observable Work** — Report location is predictable
- **Opinionated** — Give recommendations, not just data
