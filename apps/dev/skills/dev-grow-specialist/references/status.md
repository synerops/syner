# status — View evolution state

Show current state of all specialists at all levels.

## When to Use

- Check progress on a specific specialist
- Overview of entire evolution pipeline
- Before deciding what to work on
- After a session to see what changed

## Input

```bash
/dev-grow-specialist status
/dev-grow-specialist status [name]
/dev-grow-specialist status --level L1
/dev-grow-specialist status --verbose
```

### Flags

| Flag | Description |
|------|-------------|
| `[name]` | Show details for specific specialist |
| `--level` | Filter by level (L0, L1, L2, L3) |
| `--verbose` | Show full details for all |

## Process

### 1. Load All Data

Read:
- `.syner/ops/dev-grow-specialist/observations.md`
- `.syner/ops/dev-grow-specialist/tracking.md`
- `.syner/ops/dev-grow-specialist/proposals/*.md`
- `.syner/artifacts/dev-grow-specialist/specialists/*.md`
- `apps/dev/agents/*.md` (filter for evolved ones)

### 2. Generate Dashboard (default)

```markdown
## Dev Grow Specialist Status

### Pipeline Overview

```
L0 Observations    L1 Proposals    L2 Specialists    L3 Subagents
     [N]       →       [N]       →       [N]       →      [N]
```

### By Level

#### L0: Observations ([N] total)

| Type | Count | Pattern Emerging |
|------|-------|------------------|
| scaffolding | [n] | [yes if 3+] |
| review | [n] | [yes if 3+] |
| testing | [n] | [yes if 3+] |
| maintenance | [n] | [yes if 3+] |
| workflow | [n] | [yes if 3+] |
| tooling | [n] | [yes if 3+] |

#### L1: Proposals ([N] total)

| Name | Consultations | Progress | Next Action |
|------|---------------|----------|-------------|
| [name] | [n]/5 | [██░░░] | [refine/graduate] |

#### L2: Specialists ([N] total)

| Name | Interactions | Progress | Next Action |
|------|--------------|----------|-------------|
| [name] | [n]/10 | [████░] | [use/promote] |

#### L3: Subagents ([N] total)

| Name | Promoted | Interactions Since | Origin |
|------|----------|-------------------|--------|
| [name] | [date] | [n] | dev-grow-specialist |

### Recent Activity

| Date | Action | Item |
|------|--------|------|
| [date] | [observed/refined/graduated/promoted] | [name] |
| ... | ... | ... |

### Recommendations

1. **Ready for action:**
   - [Proposal X ready for graduation]
   - [Specialist Y ready for promotion]

2. **Needs attention:**
   - [Pattern emerging in scaffolding (3 observations)]
   - [Proposal Z stale (no activity in 2 weeks)]

3. **Next steps:**
   - `/dev-grow-specialist [recommended command]`
```

### 3. Generate Specific Status (if name provided)

```markdown
## Status: [name]

**Level:** [L1 Proposal / L2 Specialist / L3 Subagent]
**Created:** [date]
**Last activity:** [date]

### Evolution History

```
L0: [date] - [N] observations of [type] friction
    ↓
L1: [date] - Proposed after detecting pattern
    ↓ [N] consultations
L2: [date] - Graduated to specialist (if applicable)
    ↓ [N] interactions
L3: [date] - Promoted to subagent (if applicable)
```

### Current State

[For L1 Proposal:]
- Consultations: [N]/5
- Scope stability: [stable/evolving]
- Last scope change: [date]
- Concrete examples: [N]

[For L2 Specialist:]
- Interactions: [N]/10
- Criticality score: [N]/3
- Autonomy score: [N]/4

[For L3 Subagent:]
- Location: `apps/dev/agents/[name].md`
- Interactions since promotion: [N]
- Background capable: [yes/no]

### Evidence Summary

**Observations:**
- [date]: [brief friction]
- [date]: [brief friction]

**Key consultations:**
- [date]: [what was decided]
- [date]: [what was decided]

**Interactions:**
- [date]: [how it helped]
- [date]: [how it helped]

### Readiness Check

[For L1:]
- [ ] 5+ consultations: [N]/5
- [ ] Scope stable: [yes/no]
- [ ] Concrete examples: [yes/no]

→ [Ready for graduation / Needs more refinement]

[For L2:]
- [ ] 10+ interactions: [N]/10
- [ ] Criticality 2+/3: [N]/3
- [ ] Autonomy 3+/4: [N]/4

→ [Ready for promotion / Needs more usage]

### Next Action

`/dev-grow-specialist [recommended command] [name]`
```

### 4. Filter by Level (if --level)

Show only items at specified level with relevant metrics.

### 5. Verbose Output (if --verbose)

Include full content of each item, not just summary.

## Dashboard Symbols

| Symbol | Meaning |
|--------|---------|
| `█` | Progress filled |
| `░` | Progress empty |
| `→` | Flow direction |
| `✓` | Threshold met |
| `✗` | Threshold not met |

## Progress Bars

```
[N]/5 consultations:
0: [░░░░░]
1: [█░░░░]
2: [██░░░]
3: [███░░]
4: [████░]
5: [█████] ✓

[N]/10 interactions:
0-1:  [░░░░░░░░░░]
2-3:  [██░░░░░░░░]
4-5:  [████░░░░░░]
6-7:  [██████░░░░]
8-9:  [████████░░]
10+:  [██████████] ✓
```

## Empty States

**No observations:**
```
## Dev Grow Specialist Status

No observations yet.

Start capturing friction:
`/dev-grow-specialist observe`

Types to watch for:
- scaffolding: Skill/agent/app creation issues
- review: Quality gate misses
- testing: Validation unclear
- maintenance: Repeated fixes
- workflow: CI/CD problems
- tooling: Missing automation
```

**No proposals:**
```
### L1: Proposals

No proposals yet.

Patterns emerging in:
- [type]: [N] observations (need [3-N] more)

Keep observing, or run:
`/dev-grow-specialist review --threshold 2`
```

**No specialists:**
```
### L2: Specialists

No specialists yet.

Active proposals:
- [name]: [N]/5 consultations

Refine proposals to graduate:
`/dev-grow-specialist refine [name]`
```

## Stale Detection

Flag items with no activity in 2+ weeks:

```markdown
### Stale Items

| Item | Level | Last Activity | Days Stale |
|------|-------|---------------|------------|
| [name] | L1 | [date] | [N] |

Consider:
- Refine to keep momentum
- Archive if no longer relevant
```
