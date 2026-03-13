# The Self-Driving Codebase

A codebase that finds its own problems and fixes them.

## What Happened

I built a workflow where syner audits its own skills, converts findings to GitHub issues, and creates PRs with fixes — ready to merge. The meta part: the skills being fixed are the same skills doing the fixing.

## The Architecture

```
skill-review.yml (scheduled 3x/day)
    ↓
/syner-skill-reviewer (batch audit)
    ↓
.syner/reports/skill-review.md
    ↓
┌─────────────────┬─────────────────┐
│ FIXEABLE        │ NEEDS_DECISION  │
│ patterns        │ patterns        │
└────────┬────────┴────────┬────────┘
         ↓                 ↓
    Apply fixes      Create issues
         ↓                 ↓
    Push branch      Assign to me
         ↓
    Create PR
```

Two paths, one source:
- **Fixeable patterns** get automated PRs
- **Needs-decision patterns** get issues for human judgment

## How It Works

### 1. Scheduled Audit

Every 8 hours, `skill-review.yml` runs `/syner-skill-reviewer` in batch mode. No arguments means "audit everything."

The reviewer checks 30+ skills for:
- Voice issues (first-person → imperative)
- Identity patterns ("You are..." → directives)
- Fragile paths (relative → project-anchored)
- Missing tool specificity
- Frontmatter inconsistencies

### 2. Pattern Grouping

The output groups findings by pattern, not by skill. This is critical — it enables batch fixes.

```markdown
## FIXEABLE

### [B2] Path Resolution — 12 skills affected
**Fix:** Anchor to project root

Skills:
- syner-daily-standup
- create-syner-agent
- ...
```

One pattern. One fix. Twelve skills.

### 3. Automated Fix

A second job reads the report and applies fixes. Same Claude, same prompts I'd use manually. Commits, pushes, creates PR.

### 4. Human Decisions

Patterns that need judgment become issues:

```markdown
## NEEDS_DECISION

### [B4] Input Handling — 2 skills affected
**Options:**
A) Use AskUserQuestion
B) Fail with error
C) Use sensible default
```

I see the issue. I pick an option. Next run, it becomes fixeable.

## The Recursion

Here's what makes it self-driving:

The workflow uses `/syner-skill-reviewer` to find problems. That skill itself gets reviewed. When it has issues, the workflow fixes them.

```
skill-review.yml
    ↓
uses: /syner-skill-reviewer
    ↓
finds issues in: /syner-skill-reviewer
    ↓
fixes: /syner-skill-reviewer
    ↓
which improves: skill-review.yml's next run
```

The tools improve themselves.

## Why It Works

### 1. Separation: Audit vs Fix

`/syner-skill-reviewer` reports. `/syner-enhance-skills` applies. The reviewer never touches files — it just documents what's wrong.

This separation means:
- Audits are safe (read-only)
- Fixes are reviewable (PR review)
- Automation is reversible (git revert)

### 2. Patterns Over Instances

Grouping by pattern makes automation feasible. "Fix first-person voice" is a single edit repeated across skills. The LLM applies the same transformation everywhere.

Instance-by-instance would be: "skill A has X, skill B has Y, skill C has Z." Pattern grouping is: "12 skills have X. Here's how to fix X."

### 3. Clear Severity

Not everything should be auto-fixed:

| Severity | Automation |
|----------|------------|
| Critical | Auto-fix (identity confusion is always wrong) |
| Warning | Auto-fix (fragile paths are fixable) |
| Suggestion | Issue (conventions need judgment) |
| Decision | Issue (human picks the approach) |

The workflow respects this. It doesn't blindly apply everything.

## The Feedback Loop

Day 1: 47 findings across 17 skills.
Day 3: 12 findings remaining.
Day 7: 3 patterns need decisions.

Each run cleans up more. Each PR teaches the skills. The codebase converges toward quality without me doing the work.

## What I Learned

**1. Self-improvement is a design pattern.**
If your tools can audit themselves, they can fix themselves. Build the audit first. The fix layer follows.

**2. LLMs are good at mechanical transformations.**
"Change all X to Y across these files" is exactly what they excel at. Pattern-based fixes are reliable.

**3. Humans decide, machines execute.**
The NEEDS_DECISION path exists for a reason. Some things require judgment. The workflow knows its limits.

**4. Git is the safety net.**
Everything is a PR. Everything is reversible. The automation can't break what git can restore.

## Next Steps

- Add `/syner-enhance-skills` to the fix job (currently raw Claude prompts)
- Implement skill caching when skills > 100
- Extend pattern to agents and packages

---

*Lo que empezó como "automatizar auditorías" terminó siendo "dejar que el código se cuide solo."*
