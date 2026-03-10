# Observe Mode

**Level:** L0 → L0
**Threshold:** Low (capture everything potentially useful)

## Purpose

Record when a design decision was made without clear criteria. This is the cheapest operation — just log it.

## When to Observe

- Component designed without clear pattern justification
- Trade-off made (UX vs accessibility, speed vs consistency) without documented reasoning
- Generic specialist consulted but lacked project context
- Decision made that might recur in future components

**Key:** Don't filter too much. Better to observe and later see it was one-off than to miss a pattern.

## Process

### 1. Prompt for Context

Ask user (can be inline if `--component` flag provided):
```
What design decision was made?
In which component/PR/file?
What criteria was unclear or missing?
Which generic specialist COULD have helped but lacked context?
```

### 2. Create/Update Observations File

**Location:** `.syner/ops/design-grow-specialist/observations.md`

**Format:**
```markdown
## YYYY-MM-DD HH:MM - [Component/Area]

**Decision:** [What was decided]
**Context:** [File/PR reference]
**Gap:** [What criteria was missing]
**Potential specialist:** [Generic that could evolve]

**Evidence:** [Link to code/PR/commit]
```

**Example:**
```markdown
## 2025-03-10 14:30 - Card Component

**Decision:** Used one-off styling instead of extending @syner/ui
**Context:** packages/ui/src/components/card.tsx
**Gap:** No clear criteria for when to extend design system vs use component-specific styles
**Potential specialist:** agency-design-ux-architect → could evolve to "design-system-evolution"

**Evidence:** See local changes in card.tsx, special spacing for design app
```

### 3. Update Tracking

**Location:** `.syner/ops/design-grow-specialist/tracking.md`

Increment observation count for potential specialist:

```markdown
## Potential Specialists (L0 tracking)

### design-system-evolution
- Observations: 4
- Last: 2025-03-10 14:30
- Sources: card.tsx, header.tsx, button.tsx, sections.tsx
- Status: Ready for proposal (threshold: 3)
```

### 4. Check Threshold

If observations for this pattern ≥ 3:
```
"This pattern has been observed 4 times.
Ready to create proposal? Run: /design-grow-specialist review"
```

## Output Template

```markdown
✅ Observation recorded

**Pattern:** [Brief description]
**Occurrence:** [X of Y observations for this pattern]
**Status:** [Below threshold / Ready for review]

Next: Run `/design-grow-specialist review` to analyze patterns
```

## Edge Cases

**Duplicate observation:**
- Same component, same decision, within 24 hours → Skip, just update timestamp
- Same pattern, different component → Record, this is signal

**Unclear which generic to evolve:**
- Leave as "TBD" in observation
- Review mode will help identify pattern

**User not sure if it's worth observing:**
- Observe it anyway (cheap)
- Review mode will filter noise
- Better false positive than false negative

## Context Loading

Minimal:
- Read existing `observations.md`
- Read existing `tracking.md`
- Don't load full codebase (user provides context)

## Validation

Before recording:
- [ ] Decision is described clearly
- [ ] File/component reference provided
- [ ] Gap is specific (not vague "could be better")
- [ ] Can complete: "We needed criteria for ___[what]___"

## Meta

This is the **highest volume, lowest friction** operation. Make it fast and easy.

**Philosophy:** Observations are cheap. Promotion is expensive.
