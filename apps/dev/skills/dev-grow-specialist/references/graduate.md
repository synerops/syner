# graduate — Proposal → Custom Specialist

Promote a mature proposal to custom specialist.

## When to Use

- Proposal has 5+ consultations
- Scope has stabilized
- 3-Condition Test still passes with concrete evidence
- You would miss it if it was gone

## Input

```bash
/dev-grow-specialist graduate [proposal-name]
/dev-grow-specialist graduate skill-validator
/dev-grow-specialist graduate skill-validator --force
/dev-grow-specialist graduate skill-validator --dry-run
```

### Flags

| Flag | Description |
|------|-------------|
| `--force` | Skip threshold checks (use with caution) |
| `--dry-run` | Preview graduation without executing |

## Process

### 1. Load Proposal

Read from `.syner/ops/dev-grow-specialist/proposals/[name].md`

Verify status is `active`

### 2. Validate Thresholds

```markdown
## Graduation Validation

### Consultation Threshold
- Required: 5
- Actual: [N]
- Status: [PASS/FAIL]

### Scope Stability
- Last scope change: [date]
- Consultations since: [N]
- Status: [PASS/FAIL] (stable if 2+ consultations without scope change)

### 3-Condition Re-validation

#### 1. Requires Judgment
[Re-assess with current scope]
- Status: [PASS/FAIL]

#### 2. Is Recurring
[Count actual consultations]
- Status: [PASS/FAIL]

#### 3. Has Concrete Evidence
[List specific examples from refinements]
- Status: [PASS/FAIL]

### Overall: [PASS/FAIL]
```

### 3. Generate Specialist File

Location: `.syner/artifacts/dev-grow-specialist/specialists/[name].md`

Create artifacts directory if needed:
```bash
mkdir -p .syner/artifacts/dev-grow-specialist/specialists
```

Format:

```markdown
---
name: [specialist-name]
type: specialist
domain: dev
created: [date]
graduated_from: proposals/[name].md
consultations_at_graduation: [N]
interactions: 0
---

# [Specialist Name]

> [One-sentence purpose - refined from proposal]

## What This Specialist Knows

[Specific knowledge about the ecosystem, derived from refinements]

### Ecosystem Patterns
[Patterns specific to syner ecosystem]

### Common Pitfalls
[What goes wrong, learned from observations]

### Best Practices
[What works, learned from consultations]

## What This Specialist Does

1. [Specific action]
2. [Specific action]
3. [Specific action]

## What This Specialist Does NOT Do

- [Explicit boundary]
- [Explicit boundary]

## Evidence Base

Graduated with [N] consultations:

| Date | Context | Outcome |
|------|---------|---------|
| [date] | [context] | [helped/learned] |
| ... | ... | ... |

## Activation

Activate when:
- [Trigger condition]
- [Trigger condition]

Don't activate when:
- [Non-trigger]
- [Non-trigger]

## Evolution Notes

[Key insights from refinement process]

---

*Level: L2 Custom Specialist | Interactions: 0 | Promotion threshold: 10*
```

### 4. Archive Proposal

Move proposal to `.syner/ops/dev-grow-specialist/archive/`

Create archive directory if needed.

Add graduation note:

```markdown
---
archived: [date]
reason: graduated
graduated_to: specialists/[name].md
---
```

### 5. Update Tracking

In `.syner/ops/dev-grow-specialist/tracking.md`:

```markdown
## [Specialist Name]

Level: L2 (Custom Specialist)
Graduated: [date]
Consultations at graduation: [N]
Interactions since: 0
Last activity: [date]
```

### 6. Output Report

```markdown
## Graduation Complete

**Specialist:** [name]
**Level:** L2 (Custom Specialist)
**Evidence:** [N] consultations, [N] concrete examples

### Created

`.syner/artifacts/dev-grow-specialist/specialists/[name].md`

### Archived

`.syner/ops/dev-grow-specialist/archive/[name].md`

### What's Different Now

This specialist is ready to be consulted during ecosystem work.
It knows:
- [Key knowledge point]
- [Key knowledge point]

### Next Steps

- Consult this specialist when [trigger]
- Track interactions
- Promote to subagent after 10+ critical interactions

Run `/dev-grow-specialist status [name]` to see current state.
```

## Validation Failures

### Consultation Threshold Not Met

```markdown
## Graduation Blocked

**Reason:** Insufficient consultations
**Required:** 5
**Actual:** [N]

### Options

1. Continue refining (recommended)
   `/dev-grow-specialist refine [name]`

2. Force graduation (not recommended)
   `/dev-grow-specialist graduate [name] --force`
   ⚠️ Forcing may produce weak specialist
```

### Scope Unstable

```markdown
## Graduation Blocked

**Reason:** Scope still evolving
**Last scope change:** [date]
**Consultations since:** [N]

The scope changed recently. Wait for 2+ consultations
without scope changes to ensure stability.

### Options

1. Continue refining until stable
2. Force graduation (risks premature crystallization)
```

### 3-Condition Failure

```markdown
## Graduation Blocked

**Reason:** 3-Condition Test failed

[Which condition failed and why]

### Analysis

This proposal may not be suitable for a specialist.
Consider:
- Is the friction actually recurring?
- Can simpler tools solve it?
- Is there concrete evidence?

### Options

1. Archive the proposal
2. Gather more evidence and retry
```

## Dry Run Output

```markdown
## Graduation Preview (Dry Run)

**Proposal:** [name]
**Would create:** `.syner/artifacts/dev-grow-specialist/specialists/[name].md`

### Validation

- Consultations: [N]/5 [PASS/FAIL]
- Scope stability: [PASS/FAIL]
- 3-Condition Test: [PASS/FAIL]

### Specialist Preview

[Show what the specialist file would contain]

Run without --dry-run to execute graduation.
```

## Force Graduation

When using `--force`:

```markdown
## Forced Graduation

⚠️ **Thresholds bypassed**

Skipped checks:
- [Which checks were skipped]

Risks:
- Specialist may have weak evidence base
- Scope may not be stable
- May need to demote back to proposal

Proceeding anyway...

[Continue with graduation]
```

Record in specialist file:

```yaml
forced_graduation: true
skipped_checks: [list]
```
