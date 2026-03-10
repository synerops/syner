# promote — Custom Specialist → Subagent

Elevate a critical specialist to autonomous subagent.

## When to Use

- Specialist has been critical in 10+ interactions
- It's needed in almost every build/review/test cycle
- It can define its own execution steps
- You would significantly miss it if removed

## Input

```bash
/dev-grow-specialist promote [specialist-name]
/dev-grow-specialist promote skill-validator
/dev-grow-specialist promote skill-validator --force
/dev-grow-specialist promote skill-validator --dry-run
```

### Flags

| Flag | Description |
|------|-------------|
| `--force` | Skip threshold checks |
| `--dry-run` | Preview promotion without executing |
| `--background` | Mark subagent as background-capable |

## Process

### 1. Load Specialist

Read from `.syner/artifacts/dev-grow-specialist/specialists/[name].md`

Verify level is L2 (Custom Specialist)

### 2. Validate Promotion Readiness

```markdown
## Promotion Validation

### Interaction Threshold
- Required: 10
- Actual: [N]
- Status: [PASS/FAIL]

### Criticality Assessment
Questions:
1. Used in most build/review/test cycles? [Y/N]
2. Improves outcomes when used? [Y/N]
3. Would workflow suffer without it? [Y/N]

Score: [N]/3
Status: [PASS (2+) / FAIL]

### Autonomy Readiness
Can the specialist define:
- [ ] Its own trigger conditions
- [ ] Its execution steps
- [ ] Its tools requirements
- [ ] Its output format

Score: [N]/4
Status: [PASS (3+) / FAIL]

### Overall: [PASS/FAIL]
```

### 3. Generate Subagent File

Location: `apps/dev/agents/[name].md`

Format:

```markdown
---
name: [specialist-name]
description: [One-line description for Task tool]
tools: [Required tools]
model: sonnet
background: [true/false]
evolved_from: .syner/artifacts/dev-grow-specialist/specialists/[name].md
promotion_date: [date]
interactions_at_promotion: [N]
---

# [Specialist Name]

> [Purpose statement]

## Origin

Evolved through dev-grow-specialist:
- L0 Observation: [date]
- L1 Proposal: [date]
- L2 Specialist: [date]
- L3 Subagent: [date]

Evidence: [N] observations → [N] consultations → [N] interactions

## Identity

[What this subagent knows about the ecosystem that generic agents don't]

### Domain Knowledge

[Specific knowledge derived from evolution]

### Ecosystem Patterns

[Patterns learned through consultations]

## What You Do

[Concrete actions this subagent takes]

### Trigger Conditions

Activate when:
- [Specific trigger]
- [Specific trigger]

### Execution Steps

1. [Step]
2. [Step]
3. [Step]

### Output Format

[What the subagent delivers]

## What You Don't Do

- [Explicit boundary]
- [Explicit boundary]

## Tools

| Tool | Purpose |
|------|---------|
| [tool] | [why needed] |

## Voice

[How this subagent communicates]

## Evidence Base

Promoted with [N] meaningful interactions:

[Summary of key interactions that proved value]

---

*Promoted: [date] | Origin: dev-grow-specialist*
```

### 4. Update Dev Agent

Consider adding to `apps/dev/agents/dev.md` skill list or documenting in specialist team section.

### 5. Archive Specialist

Move to archive with promotion note:

```markdown
---
archived: [date]
reason: promoted
promoted_to: apps/dev/agents/[name].md
---
```

### 6. Update Tracking

```markdown
## [Specialist Name]

Level: L3 (Subagent)
Promoted: [date]
Interactions at promotion: [N]
Location: apps/dev/agents/[name].md
```

### 7. Create Symlink (if needed)

```bash
ln -s ../apps/dev/agents/[name].md .claude/agents/[name]
```

### 8. Output Report

```markdown
## Promotion Complete

**Subagent:** [name]
**Level:** L3 (Autonomous Subagent)
**Evidence:** [N] interactions proving critical value

### Created

`apps/dev/agents/[name].md`

### What's Different Now

This is now an autonomous subagent that can be:
- Invoked via Task tool
- Run in background (if enabled)
- Used by other agents

### Evolution Journey

```
L0: [N] observations of [friction type]
    ↓
L1: [N] consultations refined scope
    ↓
L2: [N] interactions proved value
    ↓
L3: Autonomous subagent
```

### What It Knows (That Generic Agents Don't)

[Key differentiators from generic agents]
```

## Validation Failures

### Interaction Threshold Not Met

```markdown
## Promotion Blocked

**Reason:** Insufficient interactions
**Required:** 10
**Actual:** [N]

This specialist hasn't been used enough to prove critical value.

### Options

1. Keep using the specialist, track interactions
2. Force promotion (not recommended)
```

### Criticality Score Low

```markdown
## Promotion Blocked

**Reason:** Not critical enough
**Score:** [N]/3

Questions failed:
- [Which questions scored N]

This specialist helps but isn't essential.

### Options

1. Continue using, reassess later
2. Consider: is this a nice-to-have, not need-to-have?
```

### Autonomy Not Ready

```markdown
## Promotion Blocked

**Reason:** Can't define autonomous execution
**Score:** [N]/4

Missing:
- [What's missing]

This specialist needs human guidance to work.

### Options

1. Define clearer execution steps
2. Identify required tools
3. Keep as L2 specialist (called manually)
```

## Dry Run Output

```markdown
## Promotion Preview (Dry Run)

**Specialist:** [name]
**Would create:** `apps/dev/agents/[name].md`

### Validation

- Interactions: [N]/10 [PASS/FAIL]
- Criticality: [N]/3 [PASS/FAIL]
- Autonomy: [N]/4 [PASS/FAIL]

### Subagent Preview

[Show what the subagent file would contain]

### Changes

- Create: `apps/dev/agents/[name].md`
- Archive: `.syner/artifacts/dev-grow-specialist/specialists/[name].md`

Run without --dry-run to execute promotion.
```

## Deprecating Generic Agents

When a custom subagent is promoted, check if it obsoletes a generic agent.

```markdown
## Generic Agent Deprecation Check

Custom subagent: [name]
Potential overlap with: agency-eng-[generic-name] or agency-test-[generic-name]

### Comparison

| Aspect | Generic | Custom |
|--------|---------|--------|
| [aspect] | [generic capability] | [custom capability] |

### Recommendation

[If significant overlap:]
Mark `agency-[name]` as deprecated for this project.
The custom subagent knows your specific ecosystem patterns.

Add to tracking:
```markdown
## Deprecated Generics (for apps/dev)

- agency-[name] → [custom-name]
  Deprecated: [date]
  Reason: Custom subagent has [N] interactions, proven value
```
```
