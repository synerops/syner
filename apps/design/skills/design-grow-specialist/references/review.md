# Review Mode

**Level:** L0 → L1
**Threshold:** Medium (requires 3+ observations of same pattern)

## Purpose

Analyze accumulated observations, detect recurring patterns, and propose custom specialists when evidence is sufficient.

## When to Review

- After several observations accumulated (suggested after every 3rd observation)
- Weekly/monthly audit of observation log
- Before starting new major feature (check what criteria might be needed)
- Manual trigger: `/design-grow-specialist review`

## Process

### 1. Load Observations

**Read:** `apps/design/vaults/syner/specialists/_observations.md`

### 2. Detect Patterns

Group observations by:
- Similar decisions (e.g., "extend design system vs one-off" appears 4 times)
- Same components/areas affected
- Same generic specialist mentioned
- Same type of criteria missing

**Algorithm:**
```
For each observation:
  - Extract decision keywords
  - Extract affected domain (components, spatial, brand, etc.)
  - Extract gap type (criteria, trade-off, context)

Group by similarity (>60% keyword overlap)

For each group with ≥3 observations:
  → Pattern detected
```

### 3. Apply 3-Condition Test (pre-filter)

For each detected pattern, ask:

**1. Requires JUDGMENT, not information?**
```
If pattern is "know how to use shadcn/ui" → NO (coding agent can Read docs)
If pattern is "decide when to break design system" → YES (requires judgment)
```

**2. Is RECURRING?**
```
If pattern appears in 1-2 components → NO (wait for more evidence)
If pattern appears in 3+ components → YES (recurring)
```

**3. Has CONCRETE evidence?**
```
If observations cite actual files/PRs → YES
If observations are vague "would be nice" → NO
```

**Pass all 3 → Propose specialist**
**Fail any → Keep observing**

### 4. Generate Proposal

For each pattern that passes:

**Create file:** `apps/design/vaults/syner/specialists/_proposals/[name].md`

**Template:**
```markdown
---
status: proposal
level: L1
created: YYYY-MM-DD
observations: [count]
consultations: 0
last_refined: YYYY-MM-DD
---

# [Specialist Name]

## Origin

**Evolved from:** [Generic specialist name, or "New pattern"]
**Evidence:** [X] observations across [Y] components

**Observations:**
- [Date]: [Component] - [Decision/gap]
- [Date]: [Component] - [Decision/gap]
- [Date]: [Component] - [Decision/gap]

## Scope (Draft v1)

**Decides:** [What decisions this specialist makes]

**Based on criteria:**
- [Criterion 1 - not in code]
- [Criterion 2 - requires judgment]

**Needed when:** [Triggering situation]

## 3-Condition Test

- [x] Requires judgment, not information
  - Rationale: [Why coding agent can't decide this]
- [x] Is recurring
  - Evidence: [X components affected]
- [x] Has concrete evidence
  - PRs/files: [List]

## Examples from Project

**Case 1:** [Component]
- Decision made: [What]
- Missing criteria: [What]
- Impact: [Result]

**Case 2:** [Component]
- Decision made: [What]
- Missing criteria: [What]
- Impact: [Result]

## Next Steps

- Needs [5] consultations before graduation
- Current: 0 consultations
- Refine scope based on real usage

## Related

- Generic: [agency-design-xxx]
- Other customs: [If any overlap]
```

### 5. Update Tracking

**Location:** `apps/design/vaults/syner/specialists/_tracking.md`

Move from "Potential Specialists (L0)" to "Proposals (L1)":

```markdown
## Proposals (L1)

### design-system-evolution
Status: proposal
Created: 2025-03-10
Observations: 4
Consultations: 0
Last refined: 2025-03-10
Threshold to graduate: 5 consultations (5 needed)
Components: card.tsx, header.tsx, button.tsx, sections.tsx
```

### 6. Mark Observations as Processed

Add note to `_observations.md`:

```markdown
---
**Processed:** 2025-03-10 - Observations 1-4 → Proposal: design-system-evolution
---
```

## Output Template

```markdown
## Review Complete

**Observations analyzed:** [count]
**Patterns detected:** [count]

### Proposals Created

✅ **[Specialist Name]**
- Evidence: [X] observations across [Y] components
- Passes 3 conditions: ✓ Judgment ✓ Recurring ✓ Evidence
- File: `_proposals/[name].md`
- Next: Needs [5] consultations before graduation

### Patterns Below Threshold

⏳ **[Pattern]**
- Evidence: [X] observations (need 3+)
- Action: Keep observing

### Patterns Rejected

❌ **[Pattern]**
- Reason: [Which condition failed]
- Action: Not viable as specialist
```

## Flags

**`--threshold N`**
Override default threshold (3) for proposal creation.

```bash
/design-grow-specialist review --threshold 2
```

**`--verbose`**
Show detailed analysis of pattern detection algorithm.

**`--dry-run`**
Show what would be proposed without creating files.

## Edge Cases

**Multiple patterns could merge:**
- If 2 patterns have >70% overlap → propose single specialist covering both
- Example: "design system extension" + "component consistency" → "design-system-evolution"

**Pattern detected but generic already covers it:**
- If `agency-design-xxx` already does this AND has been used in project → skip
- Mark generic as "active in project" in tracking

**No patterns above threshold:**
- Output: "Keep observing. Highest pattern has [X] observations, need 3+"
- Don't force proposals just because user ran review

## Context Loading

Moderate:
- Read `_observations.md` (full)
- Read `_tracking.md` (full)
- Grep component files mentioned for quick context
- Don't deep-read entire codebase yet

## Validation

Before creating proposal:
- [ ] Pattern has ≥3 observations (or custom threshold)
- [ ] 3-condition test passes
- [ ] Scope can be stated in one sentence
- [ ] Related components are cited
- [ ] Generic specialist (if any) is identified

## Philosophy

**False negatives are OK.** Better to wait for one more observation than to create a proposal that's not quite right.

**Proposals are drafts.** They WILL be refined based on usage. Don't try to make them perfect here.
