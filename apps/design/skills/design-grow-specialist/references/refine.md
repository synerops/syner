# Refine Mode

**Level:** L1 → L1 (improves proposal quality)
**Threshold:** Low (refine anytime based on new usage)

## Purpose

Improve a proposal based on real consultations, adding concrete examples from the codebase, sharpening scope, and evolving format.

## When to Refine

- After each consultation of the proposal
- When scope feels unclear or too broad
- When new examples emerge from codebase
- When format isn't working for fast decision-making
- Before graduation (ensure quality)

## Process

### 1. Load Proposal

**Read:** `apps/design/vaults/syner/specialists/_proposals/[name].md`

### 2. Load Recent Context

**Ask user or detect:**
- Was this proposal just consulted? For what component/decision?
- What worked well about the current scope?
- What was unclear or missing?
- Did the format help or hinder the decision?

### 3. Analyze Scope Clarity

**Current scope statement:**
```markdown
**Decides:** [Current description]
```

**Questions:**
- Can you state it in one sentence?
- Does it overlap with another proposal/specialist?
- Is it too broad (trying to do too much)?
- Is it too narrow (only applies to 1 component)?

**Refine if needed:**
- Make more specific
- Remove overlapping concerns
- Split if it's really 2 specialists

### 4. Add Concrete Examples

**From codebase:**
```bash
# Grep for patterns mentioned in proposal
grep -r "[pattern]" apps/design/components/

# Read actual files where this was needed
Read apps/design/components/[example].tsx
```

**Add to proposal:**
```markdown
## Examples from Project

**Case [N]:** [Component file]
- **Context:** [What was being built]
- **Decision needed:** [Specific choice]
- **Criteria applied:** [How specialist would decide]
- **Outcome:** [What was chosen + why]
- **Code:** `[file:line]`
```

### 5. Evolve Format (if needed)

**Detect if format should change:**

Current proposals use generic template. If consultations show a pattern, adapt:

**Example:**
If every consultation is "should I extend design system or go custom?", create decision tree:

```markdown
## Decision Framework

Start here:
  Is this component used in 2+ apps? → Extend @syner/ui
    ↓ No
  Is this pattern likely to repeat? → Extend @syner/ui
    ↓ No
  Is it tightly coupled to one feature? → Custom component
    ↓
  Document why (add comment in code)

Edge cases:
- [List specific exceptions]
```

**Track format evolution:**
```markdown
## Format Evolution

- v1 (created): Generic template
- v2 (refined YYYY-MM-DD): Added decision tree
- v3 (refined YYYY-MM-DD): Added edge cases section

Status: Format has evolved → point in favor of graduation
```

### 6. Update Criteria

Based on new examples, sharpen criteria:

**Before:**
```markdown
**Criteria:**
- Maintainability
- Consistency
```

**After:**
```markdown
**Criteria:**
- **Reusability threshold:** Used in ≥2 apps → @syner/ui, else custom
- **Change frequency:** Changes monthly → package, else component
- **Coupling:** Tightly coupled to feature → custom, loosely coupled → shared
```

### 7. Update Tracking

Increment refinement count:

```markdown
## Proposals (L1)

### design-system-evolution
Status: proposal
Consultations: 3
Refinements: 2  ← Increment
Last refined: YYYY-MM-DD  ← Update
Format evolved: Yes  ← Track if format changed
```

### 8. Check Graduation Readiness

After refinement, evaluate:
- Consultations ≥ 5? → Ready to graduate
- Scope clear and stable? → Ready
- Format evolved? → Positive signal

**If ready:**
```
This proposal is ready for graduation.
Run: /design-grow-specialist graduate [name]
```

## Output Template

```markdown
## Refinement Complete ✨

**Proposal:** [Name]
**Refinement:** v[N]

**Changes:**
- Scope: [Clarified/Narrowed/Split/No change]
- Examples: Added [N] concrete cases from codebase
- Criteria: [Sharpened/Expanded/No change]
- Format: [Evolved/Unchanged]

**New Examples:**
- [component.tsx]: [Brief description]
- [component.tsx]: [Brief description]

**Status:**
- Consultations: [X] / 5 needed
- Refinements: [N]
- Format evolved: [Yes/No]
- Ready for graduation: [Yes/No]

**Next:**
- [If ready]: Run `/design-grow-specialist graduate [name]`
- [If not]: Needs [N] more consultations
```

## Flags

**`--add-example [file]`**
Explicitly add example from specific file.

```bash
/design-grow-specialist refine design-system-evolution --add-example card.tsx
```

**`--scope "[new description]"`**
Update scope statement directly.

**`--verbose`**
Show detailed analysis of current vs refined version.

## Edge Cases

**Scope is unstable (changes every refinement):**
- Red flag for graduation
- Might mean it's really 2 specialists
- Or pattern isn't clear yet
- Action: Keep observing, don't rush

**Proposal becomes identical to existing specialist:**
- Merge with existing
- Archive this proposal
- Consolidate tracking data

**Proposal grows too complex:**
- Consider splitting into 2 proposals
- Each should have single clear scope
- Don't create mega-specialists

## Context Loading

Moderate:
- Read proposal file
- Read tracking data
- Grep/Read examples mentioned
- Read related components if adding examples

## Validation

After refinement:
- [ ] Scope fits in one sentence
- [ ] Has ≥2 concrete project examples
- [ ] Criteria are specific (not vague)
- [ ] Doesn't overlap >70% with another proposal
- [ ] Format is evolving based on usage (or stable if working)

## Philosophy

**Refinement is iteration.** Proposals get better through real usage, not by thinking harder upfront.

**Format evolution is signal.** If the proposal structure adapts to make consultations faster, it's maturing.

**Don't over-refine.** If it's working, leave it. Refinement should respond to friction, not speculation about "better" formats.
