# review — Detect patterns in observations

Analyze accumulated observations, detect recurring patterns, propose specialists.

## When to Use

- After accumulating several observations
- Weekly ecosystem health check
- Before starting a new skill/agent/workflow
- When same friction keeps happening

## Input

```bash
/dev-grow-specialist review
/dev-grow-specialist review --threshold 2
/dev-grow-specialist review --type scaffolding
```

### Flags

| Flag | Description | Default |
|------|-------------|---------|
| `--threshold` | Minimum observations to propose | 3 |
| `--type` | Focus on specific friction type | All |

## Process

### 1. Load Observations

Read `.syner/ops/dev-grow-specialist/observations.md`

### 2. Group by Type

```
scaffolding: [list of observations]
review: [list of observations]
testing: [list of observations]
maintenance: [list of observations]
workflow: [list of observations]
tooling: [list of observations]
```

### 3. Count Occurrences

For each type, count observations.

### 4. Identify Patterns

For types meeting threshold (default: 3):

1. **Extract common elements**
   - What context appears repeatedly?
   - What "would have helped" patterns emerge?
   - Are there common triggers?

2. **Name the pattern**
   - Use descriptive, action-oriented names
   - Examples: `skill-structure-validator`, `workflow-path-checker`, `symlink-auto-fixer`

### 5. Apply 3-Condition Test

For each potential pattern:

```markdown
### Pattern: [name]

#### Condition 1: Requires Judgment
Can a coding agent with Read/Grep solve this?
- [ ] NO → Pass
- [ ] YES → Fail (just needs docs/code)

#### Condition 2: Is Recurring
Does this appear across multiple build/review/test cycles?
- [ ] YES (3+ occurrences) → Pass
- [ ] NO (1-2 times) → Fail

#### Condition 3: Has Concrete Evidence
Are there specific PRs/skills/workflows where this occurred?
- [ ] YES (cites actual instances) → Pass
- [ ] NO (vague "would be useful") → Fail

**Result:** [PASS/FAIL]
```

### 6. Create Proposals

For patterns passing 3-Condition Test, create proposal in `.syner/ops/dev-grow-specialist/proposals/[name].md`:

```markdown
---
name: [pattern-name]
type: proposal
created: [date]
observations: [count]
consultations: 0
status: active
---

# [Pattern Name]

> [One-sentence purpose]

## Evidence

| Date | Type | Friction |
|------|------|----------|
| [date] | [type] | [brief description] |
| ... | ... | ... |

## 3-Condition Test

✅ 1. Requires Judgment: [why]
✅ 2. Is Recurring: [count] observations
✅ 3. Has Concrete Evidence: [list]

## Proposed Scope

What this specialist would know:
- [Knowledge area]
- [Knowledge area]

What this specialist would do:
- [Action]
- [Action]

## Open Questions

- [Question about scope]
- [Question about implementation]

---

*Status: L1 Proposal | Consultations: 0 | Graduate threshold: 5*
```

### 7. Update Tracking

In `.syner/ops/dev-grow-specialist/tracking.md`:

```markdown
## [Pattern Name]

Level: L1 (Proposal)
Created: [date]
Observations: [count]
Consultations: 0
Last activity: [date]
```

### 8. Output Report

```markdown
## Review Complete

**Observations analyzed:** [N]
**Patterns detected:** [N]
**Proposals created:** [N]

### By Type

| Type | Count | Patterns |
|------|-------|----------|
| scaffolding | [n] | [patterns or "below threshold"] |
| review | [n] | [patterns or "below threshold"] |
| testing | [n] | [patterns or "below threshold"] |
| maintenance | [n] | [patterns or "below threshold"] |
| workflow | [n] | [patterns or "below threshold"] |
| tooling | [n] | [patterns or "below threshold"] |

### New Proposals

[For each new proposal:]

**[name]**
- Evidence: [N] observations
- Scope: [one-line description]
- Path: `.syner/ops/dev-grow-specialist/proposals/[name].md`

### Existing Proposals (updated)

[For proposals that got new evidence:]

**[name]**
- New observations: [N]
- Total: [N]

### Below Threshold

[Types that didn't meet threshold:]

- [type]: [N] observations (need [threshold - N] more)

### Next Steps

1. Review new proposals: `/dev-grow-specialist status [name]`
2. Refine promising proposals: `/dev-grow-specialist refine [name]`
3. Keep observing friction: `/dev-grow-specialist observe`
```

## Edge Cases

**No observations:**
```
No observations found.
Start logging friction: `/dev-grow-specialist observe`
```

**All below threshold:**
```
No patterns meet threshold ([N]).
Current observations:
- [type]: [count]
- ...

Keep observing. Patterns emerge over time.
```

**Pattern already proposed:**
→ Add new observations as evidence to existing proposal
→ Increment observation count
→ Note in output

## Threshold Guidance

| Threshold | When to use |
|-----------|-------------|
| 3 (default) | Normal operation |
| 2 | Early exploration, want to see emerging patterns |
| 1 | Debugging, checking if specific friction logged |
| 5+ | High confidence required before proposing |
