# refine — Improve a proposal

Enhance proposal based on real usage, add concrete examples from your notes.

## When to Use

- After consulting a proposal during real work
- Before graduation (ensure scope is stable)
- When you have new examples that sharpen the scope
- When the proposal helped (or didn't)

## Input

```bash
/notes-grow-specialist refine [proposal-name]
/notes-grow-specialist refine retrieval-optimizer
/notes-grow-specialist refine retrieval-optimizer --add-example "Mar 5 search failure"
/notes-grow-specialist refine retrieval-optimizer --scope "vocabulary mapping across vaults"
```

### Flags

| Flag | Description |
|------|-------------|
| `--add-example` | Add a specific example |
| `--scope` | Update scope description |
| `--worked` | Record that consultation helped |
| `--failed` | Record that consultation didn't help |
| `--note` | Add refinement note |

## Process

### 1. Load Proposal

Read from `.syner/ops/notes-grow-specialist/proposals/[name].md`

Verify status is `proposal` (not already graduated)

### 2. Gather Refinement

If no flags provided, prompt:

```
What happened when you consulted this proposal?
- It helped with: [description]
- It didn't help because: [description]
- New example: [specific instance]
- Scope adjustment: [how scope should change]
```

### 3. Update Proposal

#### Increment Consultation Count

```yaml
consultations: [N+1]
last_refined: [date]
```

#### Add to Refinement Log

Append to proposal:

```markdown
## Refinement Log

### [Date] - Consultation [N]

**Context:** [what you were doing]
**Result:** [helped/didn't help]
**Insight:** [what you learned about scope]
**Example:** [specific instance, if any]
```

#### Update Scope (if changed)

If scope is sharpening, update the Scope section.

Track evolution:

```markdown
## Scope Evolution

| Version | Scope | Date |
|---------|-------|------|
| v1 | [original] | [date] |
| v2 | [refined] | [date] |
```

### 4. Check Graduation Readiness

After refinement, assess:

```markdown
## Graduation Readiness

- [x] 5+ consultations: [N]/5
- [ ] Scope stable (no major changes in last 2 refinements)
- [ ] Examples concrete and specific
- [ ] Would miss it if gone

**Status:** [Ready/Not Ready] for graduation
```

### 5. Output Report

```markdown
## Refinement Complete

**Proposal:** [name]
**Consultations:** [N] (threshold: 5)
**Last scope change:** [date or "stable"]

### What Changed

[Summary of refinement]

### Graduation Status

[Ready/Not ready] - [reason]

[If ready:]
Run `/notes-grow-specialist graduate [name]` to promote.
```

## Refinement Signals

### Positive Signals (scope solidifying)

- Same examples keep fitting
- Scope description stabilizes
- "Would have helped" predictions come true
- Consultations consistently help

### Negative Signals (needs more work)

- Scope keeps changing significantly
- Examples don't quite fit
- Consultations sometimes help, sometimes don't
- Overlaps with other proposals

### Split Signals

- Two distinct use cases emerging
- "This helped for X but not Y"
- Scope too broad to be useful

→ Consider splitting into two proposals

## Edge Cases

**Proposal doesn't exist:**
→ Error with suggestion to check status

**Already graduated:**
→ Error explaining refinement is for proposals only

**Consultation didn't help at all:**
→ Record as negative signal, may indicate bad pattern detection

**Scope changed dramatically:**
→ Consider archiving and creating new proposal

## Output Template

```markdown
## Refinement Complete

**Proposal:** [name]
**Consultations:** [N]/5
**Scope stability:** [stable/evolving]

### This Refinement

- Context: [what user was doing]
- Result: [helped/didn't help]
- Insight: [scope adjustment or confirmation]

### Graduation Status

[If N >= 5 and stable:]
✅ Ready for graduation
Run `/notes-grow-specialist graduate [name]`

[If N < 5:]
📊 [N]/5 consultations
Keep consulting and refining.

[If unstable:]
⚠️ Scope still evolving
Last 2 refinements changed scope. Keep refining.
```

## Scope Evolution Tracking

Track how the proposal's understanding evolves:

```markdown
## Scope Evolution

### v1 (Created)
"Helps find notes when search terms don't match"
- Broad, vague

### v2 (After 2 consultations)
"Maps my vocabulary across vaults"
- More specific

### v3 (After 4 consultations)
"Knows I call 'PKM' in dev vault, 'note-taking' in personal vault,
'knowledge management' in work vault"
- Concrete, specific to user
```

This evolution IS the refinement working. Generic → Specific → Personal.
