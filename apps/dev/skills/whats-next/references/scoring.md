# Prioritization Scoring

Calculate priority scores for each item/pattern to determine what to work on first.

## Base Score Factors

| Factor | Weight | Description |
|--------|--------|-------------|
| Friction frequency (7d) | +5/occurrence | Each friction observation in last 7 days |
| Has related backlog | +3 | Backlog item documents this pattern |
| Has GitHub issue | +2 | Issue tracks this work |
| Issue `needs-decision` label | +10 | Blocked waiting for decision |
| Issue > 7 days old | +3 | Aging issue needs attention |
| Task in progress | +5 | Active work happening |
| Affects orchestration | +4 | Touches /syner, routing, or core skills |
| Cross-domain | +3 | Impacts multiple apps/packages |

## Priority Tiers

| Tier | Score | Meaning |
|------|-------|---------|
| P1 | >= 15 | Work on this today |
| P2 | 8-14 | Work on this this week |
| P3 | < 8 | Nice to have, schedule later |

## Example Calculations

### Example 1: Repeated friction with issue
- Friction: "gh auth fails" observed 3 times in 7 days (+15)
- Has related backlog item (+3)
- Has open issue #23 (+2)
- Issue older than 7 days (+3)
- **Total: 23 → P1**

### Example 2: New backlog item
- No friction observations (+0)
- Backlog item exists (+3)
- No issue yet (+0)
- **Total: 3 → P3**

### Example 3: Core skill friction
- Friction: "/syner routing fails" observed once (+5)
- Affects orchestration (+4)
- No backlog yet (+0)
- **Total: 9 → P2**

## Tie-Breaking

When scores are equal, prioritize by:

1. **Effort** — Lower effort first (quick wins)
2. **Recency** — More recent friction first
3. **Specificity** — More concrete items over vague ones

## Score Adjustments

### Penalties
- **Stale item** (no activity 30d): -5
- **Blocked by other item**: -3 (unless blocker is P1)
- **Vague description**: -2

### Bonuses
- **User mentioned it today**: +8 (direct signal)
- **Failed build/test**: +10 (urgent)
- **Security concern**: +15 (always high priority)

## Output

For each item, record:
```
Item: [description]
Score: [total]
Tier: [P1/P2/P3]
Breakdown:
  - [factor]: +X
  - [factor]: +Y
```
