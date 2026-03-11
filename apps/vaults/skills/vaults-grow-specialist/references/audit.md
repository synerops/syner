# audit — Detect redundancy and cleanup

Find overlapping specialists, mark deprecated generics, clean stale proposals.

## When to Use

- Monthly maintenance
- When specialist count grows
- When you suspect overlap
- Before creating new proposals

## Input

```bash
/vaults-grow-specialist audit
/vaults-grow-specialist audit --mark-deprecated
/vaults-grow-specialist audit --archive-stale
/vaults-grow-specialist audit --threshold 30
```

### Flags

| Flag | Description | Default |
|------|-------------|---------|
| `--mark-deprecated` | Auto-mark deprecated generics | false |
| `--archive-stale` | Auto-archive unused proposals | false |
| `--threshold` | Days without activity = stale | 30 |
| `--verbose` | Show detailed analysis | false |

## Process

### 1. Load All Specialists

Gather from:
- `.syner/ops/vaults-grow-specialist/proposals/` (L1)
- `.syner/artifacts/vaults-grow-specialist/specialists/` (L2)
- `apps/vaults/agents/` (L3, evolved ones)
- Generic agents (agency-* relevant to notes)

### 2. Detect Overlap

Compare each pair for:

**Scope similarity:**
- Similar "What it does"
- Similar trigger conditions
- Similar friction types addressed

**Evidence overlap:**
- Same observations cited
- Same examples used

**Threshold:** >70% similarity = overlap concern

### 3. Identify Stale Items

**Stale proposal:**
- No consultations in [threshold] days
- Never consulted after creation
- Scope changed but never stabilized

**Stale specialist:**
- No interactions in [threshold] days
- Created but never used

### 4. Check Generic Deprecation

For each custom specialist/subagent:
- Find potentially overlapping generic agents
- Compare capabilities
- Recommend deprecation if custom > generic

### 5. Generate Report

```markdown
## Audit Report

**Date:** [date]
**Scope:** vaults-grow-specialist ecosystem

### Summary

| Level | Count | Healthy | Concerns |
|-------|-------|---------|----------|
| L1 Proposals | [N] | [N] | [N] |
| L2 Specialists | [N] | [N] | [N] |
| L3 Subagents | [N] | [N] | [N] |
| Generic (relevant) | [N] | [N] | [N] deprecated |

### Overlap Detected

[If any:]

#### [Specialist A] ↔ [Specialist B]

**Similarity:** [N]%
**Overlap in:**
- [Shared scope area]
- [Shared scope area]

**Recommendation:**
- [ ] Merge into single specialist
- [ ] Differentiate scope more clearly
- [ ] Keep both (justified because: [reason])

[If none:]
No significant overlap detected.

### Stale Items

[If any:]

#### Proposals (no activity in [threshold] days)

| Name | Created | Last Activity | Consultations |
|------|---------|---------------|---------------|
| [name] | [date] | [date] | [N] |

**Recommendation:** Archive or actively consult

#### Specialists (no interactions in [threshold] days)

| Name | Graduated | Last Interaction | Total |
|------|-----------|------------------|-------|
| [name] | [date] | [date] | [N] |

**Recommendation:** Demote to proposal or archive

[If none:]
No stale items detected.

### Generic Deprecation Candidates

[If any:]

| Generic | Custom Replacement | Reason |
|---------|-------------------|--------|
| agency-[name] | [custom-name] | [why custom is better] |

[If --mark-deprecated:]
Marked as deprecated in tracking.

[If not:]
Run with `--mark-deprecated` to mark these.

### Health Score

**Overall:** [Good/Fair/Needs Attention]

[Summary of ecosystem health]
```

## Overlap Analysis

### Similarity Calculation

```
similarity = (
  scope_overlap * 0.4 +
  evidence_overlap * 0.3 +
  trigger_overlap * 0.3
)
```

### Scope Overlap

Compare "What it does" sections:
- Exact phrase matches
- Semantic similarity
- Friction types addressed

### Evidence Overlap

Compare observations/examples cited:
- Same dates
- Same friction descriptions
- Same "would have helped"

### Trigger Overlap

Compare activation conditions:
- Same contexts
- Same friction types
- Same workflows

## Staleness Detection

### Proposal Staleness

```markdown
## Stale Proposal: [name]

**Created:** [date]
**Days since creation:** [N]
**Consultations:** [N]
**Last consultation:** [date or "never"]

### Analysis

[If never consulted:]
This proposal was created but never used. Either:
- The friction stopped occurring
- The proposal doesn't match real needs
- It was forgotten

[If consulted but stale:]
This proposal was consulted [N] times but not recently.
Either the friction is solved or the proposal isn't helping.

### Recommendation

- [ ] Archive (friction seems resolved)
- [ ] Consult now (friction still exists)
- [ ] Merge with another proposal
```

### Specialist Staleness

```markdown
## Stale Specialist: [name]

**Graduated:** [date]
**Interactions:** [N]
**Last interaction:** [date]

### Analysis

This specialist graduated but isn't being used.
Possible reasons:
- Scope too narrow
- Not activated when relevant
- Problem solved differently

### Recommendation

- [ ] Demote to proposal (needs more refinement)
- [ ] Archive (no longer needed)
- [ ] Actively integrate into workflow
```

## Auto-Actions

### --mark-deprecated

When used:

```markdown
## Auto-Deprecated

Marked the following generics as deprecated:

| Generic | Replacement | Reason |
|---------|-------------|--------|
| [name] | [custom] | [reason] |

Updated in `.syner/ops/vaults-grow-specialist/tracking.md`
```

### --archive-stale

When used:

```markdown
## Auto-Archived

Moved the following to archive:

| Type | Name | Reason |
|------|------|--------|
| proposal | [name] | No consultations in [N] days |
| specialist | [name] | No interactions in [N] days |

Files moved to `.syner/ops/vaults-grow-specialist/archive/`
```

## Output Template

```markdown
## Audit Complete

### Quick Stats

- Proposals: [N] ([N] healthy, [N] stale)
- Specialists: [N] ([N] healthy, [N] stale)
- Subagents: [N]
- Overlaps detected: [N]
- Deprecation candidates: [N]

### Actions Needed

[If any issues:]
1. [Action item]
2. [Action item]

[If healthy:]
Ecosystem is healthy. No immediate actions needed.

### Next Audit

Recommended: [date + 30 days]
```
