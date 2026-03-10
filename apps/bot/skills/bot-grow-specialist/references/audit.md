# audit — Detect redundancy and cleanup

Find overlapping specialists and identify gaps in coverage.

## When to Use

- Monthly maintenance
- When specialist count grows
- Before adding new proposals
- When bot behavior feels inconsistent

## Input

```bash
/bot-grow-specialist audit
/bot-grow-specialist audit --mark-deprecated
/bot-grow-specialist audit --check-gaps
```

### Flags

| Flag | Description | Default |
|------|-------------|---------|
| `--mark-deprecated` | Mark overlapping specialists as deprecated | false |
| `--check-gaps` | Identify friction types with no coverage | false |
| `--level` | Audit specific level (L0/L1/L2/L3) | All |

## Process

### 1. Load All Specialists

Gather from:
- `.syner/ops/bot-grow-specialist/observations.md` (L0)
- `.syner/ops/bot-grow-specialist/proposals/` (L1)
- `.syner/artifacts/bot-grow-specialist/specialists/` (L2)
- `apps/bot/agents/` (L3)

### 2. Detect Overlap

Compare specialists for:
- Similar scope statements
- Overlapping triggers
- Same friction type coverage
- Duplicate examples

Flag as overlap if:
- >50% scope overlap
- Same friction type with similar methodology

### 3. Identify Stale Items

Check for:
- Proposals not consulted in 30+ days
- Specialists not invoked in 30+ days
- Observations older than 60 days without proposal

### 4. Check Gaps

For each friction type, check:
- Any observations?
- Any proposals?
- Any specialists?
- Any subagents?

Identify types with observations but no proposals (gap).

### 5. Generate Report

```markdown
# Bot Grow Specialist Audit

**Date:** {date}

## Summary

- Observations: {count}
- Proposals: {count}
- Specialists: {count}
- Subagents: {count}

## Overlaps Detected

### {name1} ↔ {name2}

**Overlap:** {percentage}%
**Reason:** {why they overlap}
**Recommendation:** {merge/deprecate one/keep both}

## Stale Items

### Proposals (not consulted 30+ days)
- {name}: Last consulted {date}
- {name}: Last consulted {date}

### Specialists (not invoked 30+ days)
- {name}: Last invoked {date}

### Old Observations (60+ days, no proposal)
- {date}: {friction type} - {brief description}

## Coverage Gaps

| Friction Type | Observations | Proposals | Specialists | Subagents |
|---------------|--------------|-----------|-------------|-----------|
| conversation  | {n}          | {n}       | {n}         | {n}       |
| response      | {n}          | {n}       | {n}         | {n}       |
| integration   | {n}          | {n}       | {n}         | {n}       |
| handoff       | {n}          | {n}       | {n}         | {n}       |
| context       | {n}          | {n}       | {n}         | {n}       |
| qualification | {n}          | {n}       | {n}         | {n}       |

**Gaps:** {types with observations but no proposals}

## Recommendations

1. {recommendation 1}
2. {recommendation 2}
...
```

### 6. Apply Deprecations (if --mark-deprecated)

For overlapping items, add to specialist:

```markdown
---
deprecated: {date}
reason: Overlaps with {other}
superseded_by: {other}
---
```

### 7. Output Summary

```
Audit complete.

Overlaps: {count}
  - {name1} ↔ {name2} ({percentage}%)

Stale items: {count}
  - {count} proposals not consulted in 30+ days
  - {count} specialists not invoked in 30+ days

Gaps: {count}
  - {type}: {observations} observations, no proposal

[If --mark-deprecated:]
Deprecated: {count} items marked

Recommendations:
  1. {recommendation}
  2. {recommendation}

Full report: .syner/ops/bot-grow-specialist/audit-{date}.md
```

## What to Look For

### Overlaps
Two specialists doing similar things. Consider:
- Can they merge?
- Is one more mature? Deprecate the other.
- Do they actually have different triggers?

### Stale proposals
Proposals that never get consulted:
- Maybe the friction wasn't real
- Maybe scope is wrong
- Consider archiving

### Coverage gaps
Friction types being observed but not addressed:
- Are there enough observations for proposal?
- Is this friction actually specialist-worthy?

## Output Template

```
Audit complete.

Health score: [Good/Needs attention/Critical]

Overlaps: [count]
[For each:]
  - [name1] ↔ [name2]: [recommendation]

Stale: [count]
[For each:]
  - [name]: Last active [date] - [archive/investigate]

Gaps: [count]
[For each:]
  - [type]: [observations] observations, consider proposal

[If --mark-deprecated:]
Marked deprecated: [count]
[List names]

Full report saved to: .syner/ops/bot-grow-specialist/audit-[date].md
```
