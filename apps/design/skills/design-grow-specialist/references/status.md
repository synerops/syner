# Status Mode

**Level:** All levels
**Threshold:** N/A (read-only query)

## Purpose

View the current state of specialist evolution. Dashboard for all specialists at all levels.

## When to Use

- Check progress toward graduation/promotion
- See what specialists exist
- Understand what's in the pipeline
- Quick overview before starting new work

## Process

### 1. Load All Data

**Read:**
```
- .syner/ops/design-grow-specialist/tracking.md
- .syner/ops/design-grow-specialist/observations.md
- .syner/ops/design-grow-specialist/proposals/*.md
- .syner/artifacts/design-grow-specialist/specialists/*.md
- apps/design/agents/*.md (design subagents)
```

### 2. Generate Overview

**Count specialists at each level:**

```
L0: [count] active observation patterns
L1: [count] proposals
L2: [count] custom specialists
L3: [count] subagents
```

### 3. Show Level Details

For each level, show summary table:

#### L0: Observations

```markdown
| Pattern | Observations | Last | Status |
|---------|--------------|------|--------|
| design-system-extension | 4 | 2025-03-10 | Ready for proposal |
| whimsy-balance | 2 | 2025-03-09 | Need 1 more |
```

#### L1: Proposals

```markdown
| Name | Consultations | Refined | Status |
|------|---------------|---------|--------|
| design-system-evolution | 3/5 | 2x | Need 2 more consultations |
| whimsy-arbiter | 1/5 | 1x | Need 4 more consultations |
```

#### L2: Custom Specialists

```markdown
| Name | Components | Last Used | Next Level |
|------|------------|-----------|------------|
| spatial-grid-specialist | 7/10 | 2025-03-10 | Need 3 more components |
```

#### L3: Subagents

```markdown
| Name | Model | Background | Components |
|------|-------|------------|------------|
| design-system-evolution | sonnet | false | 12 |
```

### 4. Show Specific Specialist (if name provided)

**Deep dive on one specialist:**

```markdown
## design-system-evolution

**Current Level:** L2 (Custom Specialist)
**Created:** 2025-03-10
**Graduated:** 2025-03-12
**Last Used:** 2025-03-15

### Evolution Timeline

- **L0:** 2025-03-10 (4 observations)
  - card.tsx, header.tsx, button.tsx, sections.tsx
- **L1:** 2025-03-10 (proposal created)
  - Consultations: 5
  - Refinements: 2
  - Format evolved: Yes
- **L2:** 2025-03-12 (graduated to specialist)
  - Components affected: 7
  - Format: Custom decision tree
- **L3:** Not yet
  - Need: 3 more components (7/10)
  - Estimated: Based on current velocity, ~2 weeks

### Usage Stats

**Consultations:** 7 total
- 2025-03-10: card.tsx
- 2025-03-11: button.tsx
- 2025-03-12: header.tsx
- 2025-03-13: footer.tsx
- 2025-03-14: sections.tsx
- 2025-03-15: nav.tsx
- 2025-03-15: sidebar.tsx

**Components Affected:** 7
**Refinements:** 2
**Format Evolution:** Yes (decision tree structure)

### 3-Condition Test

- ✓ Requires judgment (not just information)
- ✓ Is recurring (7 components)
- ✓ Has evidence (concrete files)

### Next Steps

**To promote to L3:**
- Affect 3 more components (current: 7, need: 10)
- Define autonomous execution steps
- Determine background capability

**Estimated time:** 2 weeks based on current usage
```

### 5. Show Velocity Metrics (optional)

**If `--stats` flag:**

```markdown
## Velocity Metrics

**Last 30 days:**
- New observations: 12
- Proposals created: 2
- Specialists graduated: 1
- Subagents promoted: 0

**Average time to graduate:**
- L0 → L1: 5 days (median)
- L1 → L2: 14 days (median)
- L2 → L3: Not enough data

**Success rate:**
- Observations → Proposals: 25% (3/12)
- Proposals → Specialists: 50% (1/2)
```

## Output Templates

### Global Status

```markdown
## Design Specialist Ecosystem

**Overview:**
- 🔍 L0 (Observations): 3 patterns
- 📝 L1 (Proposals): 2 active
- ⚙️ L2 (Specialists): 1 active
- 🚀 L3 (Subagents): 0 active

**Pipeline:**
- Ready for proposal: 1
- Ready for graduation: 0
- Ready for promotion: 0

**Deprecated:**
- Generics: 2 (agency-design-ux-architect, agency-design-ui-designer)
- Proposals: 0

---

[Detailed tables by level]
```

### Single Specialist Status

```markdown
## [Specialist Name] Status

**Level:** [L0/L1/L2/L3]
**Created:** [Date]
**Status:** [Description]

### Progress

[Progress bar or table showing threshold]

### Evolution History

[Timeline]

### Next Steps

[What needs to happen for next level]
```

## Flags

**`--stats`**
Include velocity metrics and analytics.

```bash
/design-grow-specialist status --stats
```

**`--level [L0/L1/L2/L3]`**
Show only specialists at specific level.

```bash
/design-grow-specialist status --level L1
```

**`--ready`**
Show only specialists ready for next level.

```bash
/design-grow-specialist status --ready
```

**`--json`**
Output in JSON format (for programmatic use).

## Edge Cases

**No specialists yet:**
```
No specialists in ecosystem yet.

Start by observing design decisions:
  /design-grow-specialist observe
```

**Everything stale:**
```
All specialists last used >60 days ago.

Consider running audit:
  /design-grow-specialist audit
```

## Context Loading

Light:
- Read tracking file (main source)
- Read observation file (counts)
- Count files in proposals/specialists/agents
- Don't read full content unless specific specialist requested

## Validation

Status output should:
- [ ] Be accurate (counts match files)
- [ ] Show clear next steps
- [ ] Indicate readiness for next level
- [ ] Be scannable (tables, not paragraphs)

## Philosophy

**Status is the pulse check.** Quick, clear, actionable.

**Show progress, not just state.** "3/5 consultations" is better than "proposal stage".

**Suggest actions.** Don't just report, guide what to do next.

## Use Cases

**Before starting new feature:**
```bash
/design-grow-specialist status --ready
# "design-system-evolution is ready for promotion"
```

**Weekly check-in:**
```bash
/design-grow-specialist status --stats
# See velocity, adjust thresholds if needed
```

**Checking specific specialist:**
```bash
/design-grow-specialist status design-system-evolution
# Deep dive on one
```

**Finding what to work on:**
```bash
/design-grow-specialist status --level L1
# Show all proposals, pick one to refine
```
