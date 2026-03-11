# status — View evolution state

Show current state of all specialists at all levels.

## When to Use

- Check progress on proposals
- See what's ready for graduation/promotion
- Weekly overview
- Before starting work (what specialists are available?)

## Input

```bash
/notes-grow-specialist status
/notes-grow-specialist status [specialist-name]
/notes-grow-specialist status --level L1
/notes-grow-specialist status --ready
/notes-grow-specialist status --stats
```

### Flags

| Flag | Description |
|------|-------------|
| `[name]` | Show detailed status for specific specialist |
| `--level` | Filter by level (L0, L1, L2, L3) |
| `--ready` | Show only items ready for next level |
| `--stats` | Include velocity metrics |
| `--verbose` | Show full details for each item |

## Process

### 1. Load All Data

Gather from:
- `.syner/ops/notes-grow-specialist/observations.md` (L0)
- `.syner/ops/notes-grow-specialist/proposals/` (L1)
- `.syner/artifacts/notes-grow-specialist/specialists/` (L2)
- `apps/notes/agents/` (L3, check for evolved_from)
- `.syner/ops/notes-grow-specialist/tracking.md` (metrics)

### 2. Build Dashboard

```markdown
## Notes Grow Specialist Status

**Last updated:** [now]

### Evolution Pipeline

```
L0 Observations    L1 Proposals    L2 Specialists    L3 Subagents
     [N]      →        [N]       →       [N]        →     [N]
```

### Level Breakdown

#### L0: Observations ([N] total)

| Type | Count | Pattern Detected |
|------|-------|------------------|
| retrieval | [N] | [Yes (3+) / No] |
| capture | [N] | [Yes / No] |
| linking | [N] | [Yes / No] |
| synthesis | [N] | [Yes / No] |
| processing | [N] | [Yes / No] |
| vocabulary | [N] | [Yes / No] |

[If any type has 3+:]
**Ready for review:** [types]
Run `/notes-grow-specialist review`

#### L1: Proposals ([N] total)

| Name | Consultations | Scope Stable | Ready |
|------|---------------|--------------|-------|
| [name] | [N]/5 | [Yes/No] | [✓/—] |
| ... | ... | ... | ... |

[If any ready:]
**Ready for graduation:** [names]

#### L2: Specialists ([N] total)

| Name | Interactions | Critical | Ready |
|------|--------------|----------|-------|
| [name] | [N]/10 | [Yes/No] | [✓/—] |
| ... | ... | ... | ... |

[If any ready:]
**Ready for promotion:** [names]

#### L3: Subagents ([N] total)

| Name | Promoted | Interactions Since | Status |
|------|----------|-------------------|--------|
| [name] | [date] | [N] | Active |
| ... | ... | ... | ... |
```

### 3. Individual Status (if name provided)

```markdown
## Status: [name]

**Level:** [L1/L2/L3]
**Created:** [date]
**Current location:** [file path]

### Progress

[Level-specific progress visualization]

#### For L1 (Proposal):
```
Consultations: ████████░░ 8/10 for graduation
Scope stability: Stable (last change 14 days ago)
```

#### For L2 (Specialist):
```
Interactions: ██████░░░░ 6/10 for promotion
Criticality: Used in 4/5 recent sessions
```

#### For L3 (Subagent):
```
Active since: [date]
Total interactions: [N]
Last used: [date]
```

### History

| Date | Event | Details |
|------|-------|---------|
| [date] | Created | From [N] observations |
| [date] | Refined | Scope updated |
| [date] | Graduated | [N] consultations |
| [date] | Promoted | [N] interactions |

### What It Knows

[Current scope/knowledge summary]

### Next Steps

[Based on current level:]

- L1: "[N] more consultations needed" or "Ready for graduation"
- L2: "[N] more interactions needed" or "Ready for promotion"
- L3: "Fully evolved. Monitor for deprecation candidates."
```

## Filtered Views

### --level L0

```markdown
## Observations Status

**Total:** [N] observations
**Oldest:** [date]
**Newest:** [date]

### By Type

| Type | Count | Trend | Action |
|------|-------|-------|--------|
| retrieval | [N] | ↑↓→ | [Review ready / Keep observing] |
| capture | [N] | ↑↓→ | ... |
| ... | ... | ... | ... |

### Recent Observations

[Last 5 observations, brief]
```

### --level L1

```markdown
## Proposals Status

**Total:** [N] proposals
**Oldest:** [date] ([name])
**Most consulted:** [name] ([N] consultations)

### All Proposals

| Name | Created | Consultations | Stability | Status |
|------|---------|---------------|-----------|--------|
| [name] | [date] | [N]/5 | [Stable/Evolving] | [Ready/In progress] |
| ... | ... | ... | ... | ... |

[Sorted by readiness for graduation]
```

### --ready

```markdown
## Ready for Advancement

### Ready for Review (L0 → L1)

| Type | Observations | Action |
|------|--------------|--------|
| [type] | [N] | `/notes-grow-specialist review --type [type]` |

### Ready for Graduation (L1 → L2)

| Proposal | Consultations | Action |
|----------|---------------|--------|
| [name] | [N] | `/notes-grow-specialist graduate [name]` |

### Ready for Promotion (L2 → L3)

| Specialist | Interactions | Action |
|------------|--------------|--------|
| [name] | [N] | `/notes-grow-specialist promote [name]` |

[If nothing ready:]
Nothing ready for advancement. Keep observing and consulting.
```

### --stats

```markdown
## Evolution Statistics

### Velocity

| Metric | Last 7 days | Last 30 days | All time |
|--------|-------------|--------------|----------|
| Observations | [N] | [N] | [N] |
| Proposals created | [N] | [N] | [N] |
| Graduations | [N] | [N] | [N] |
| Promotions | [N] | [N] | [N] |

### Conversion Rates

```
Observations → Proposals:  [N]% ([N]/[N])
Proposals → Specialists:   [N]% ([N]/[N])
Specialists → Subagents:   [N]% ([N]/[N])
```

### Health Indicators

| Indicator | Status | Notes |
|-----------|--------|-------|
| Observation rate | [Good/Low] | [N] per week |
| Proposal activity | [Good/Stale] | [N] consultations this week |
| Specialist usage | [Good/Low] | [N] interactions this week |

### Friction Type Distribution

```
retrieval:   ████████░░ 40%
capture:     ████░░░░░░ 20%
linking:     ███░░░░░░░ 15%
synthesis:   ██░░░░░░░░ 10%
processing:  ██░░░░░░░░ 10%
vocabulary:  █░░░░░░░░░ 5%
```

[Insights about what friction types are most common]
```

## Output Template (Default)

```markdown
## Notes Grow Specialist Status

```
L0 Observations    L1 Proposals    L2 Specialists    L3 Subagents
     [N]      →        [N]       →       [N]        →     [N]
```

### Ready for Action

[If anything ready:]
- **Review:** [N] friction types have patterns
- **Graduate:** [names] ready
- **Promote:** [names] ready

[If nothing ready:]
Nothing ready for advancement.

### Quick Actions

- Add observation: `/notes-grow-specialist observe`
- Review patterns: `/notes-grow-specialist review`
- See details: `/notes-grow-specialist status [name]`
- Full stats: `/notes-grow-specialist status --stats`
```
