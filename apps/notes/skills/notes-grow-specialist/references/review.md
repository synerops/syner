# review — Detect patterns in observations

Analyze accumulated observations, detect recurring patterns, propose specialists.

## When to Use

- After accumulating several observations
- Weekly check-in
- When you sense a pattern but haven't formalized it

## Input

```bash
/notes-grow-specialist review
/notes-grow-specialist review --threshold 2
/notes-grow-specialist review --type retrieval
/notes-grow-specialist review --dry-run
```

### Flags

| Flag | Description | Default |
|------|-------------|---------|
| `--threshold` | Minimum observations to propose | 3 |
| `--type` | Focus on specific friction type | All |
| `--dry-run` | Preview proposals without creating | false |

## Process

### 1. Load Observations

Read `.syner/ops/notes-grow-specialist/observations.md`

Parse into structured data:
- Date
- Type
- Friction description
- Context
- "Would have helped"

### 2. Detect Patterns

Group by type, then analyze within each type for:

**Similarity signals:**
- Same words/phrases appearing
- Same context (time, place, activity)
- Same "would have helped" suggestions
- Same underlying need

**Pattern threshold:** 3+ observations with similarity

### 3. Apply 3-Condition Test

For each detected pattern:

```markdown
## Pattern: [name]

### Condition 1: Requires Judgment?
Can Read/Grep solve this?
- [ ] NO - requires learning user's patterns
- [ ] YES - basic tooling sufficient

### Condition 2: Is Recurring?
Happens regularly?
- [ ] YES - [N] observations over [timeframe]
- [ ] NO - isolated incidents

### Condition 3: Has Concrete Evidence?
Specific friction moments cited?
- [ ] YES - [list dates/contexts]
- [ ] NO - vague/hypothetical

**Result:** [PASS/FAIL]
```

### 4. Create Proposals

For patterns that pass, create proposal file.

Location: `.syner/ops/notes-grow-specialist/proposals/[name].md`

Format:

```markdown
---
name: [specialist-name]
status: proposal
created: [date]
observations: [count]
consultations: 0
last_refined: [date]
---

# [Specialist Name]

> [One-sentence purpose]

## Origin

Created from [N] observations of [type] friction.

### Evidence

| Date | Friction | Context |
|------|----------|---------|
| [date] | [friction] | [context] |
| ... | ... | ... |

## Scope

**This specialist knows:**
- [What it understands about the user]
- [What patterns it recognizes]

**This specialist does:**
- [What actions it takes]

**This specialist does NOT:**
- [Explicit boundaries]

## 3-Condition Validation

✅ Requires judgment: [explanation]
✅ Is recurring: [N] observations in [timeframe]
✅ Has evidence: [summary]

## Next Steps

- [ ] Consult this proposal when relevant friction occurs
- [ ] Refine scope based on consultations
- [ ] Graduate after 5+ consultations

---

*Status: L1 Proposal | Consultations: 0 | Threshold: 5*
```

### 5. Update Tracking

Add to `.syner/ops/notes-grow-specialist/tracking.md`:

```markdown
## [Specialist Name]

Created: [date]
Level: L1 (Proposal)
Observations: [N]
Consultations: 0
Last activity: [date]
```

### 6. Output Report

```markdown
## Review Complete

**Observations analyzed:** [N]
**Patterns detected:** [N]
**Proposals created:** [N]

### New Proposals

| Name | Type | Observations | Status |
|------|------|--------------|--------|
| [name] | [type] | [N] | Created |
| ... | ... | ... | ... |

### Patterns Below Threshold

| Type | Count | Needed |
|------|-------|--------|
| [type] | [N] | [threshold] |

### No Pattern Detected

[N] observations didn't cluster into patterns.
Keep observing — patterns emerge over time.
```

## Pattern Detection Heuristics

### Retrieval Patterns

Look for:
- Same search terms failing
- Same type of content unfindable
- Same vocabulary mismatch
- Same time-of-capture → hard-to-find

### Capture Patterns

Look for:
- Same context (location, activity)
- Same type of idea (fleeting, meeting, voice)
- Same friction point (no device, awkward input)

### Linking Patterns

Look for:
- Same domains not connecting
- Same type of relationship missed
- Same discovery method (accidental)

### Synthesis Patterns

Look for:
- Same type of notes failing to combine
- Same missing trigger for synthesis
- Same "had pieces, missed pattern"

### Processing Patterns

Look for:
- Same backlog type
- Same processing friction
- Same "never got to it"

### Vocabulary Patterns

Look for:
- Same concepts, different words
- Same cross-vault inconsistency
- Same domain bridging failure

## Edge Cases

**Not enough observations:**
→ Report what exists, encourage more observation

**All observations are unique:**
→ No proposals. Patterns emerge over time.

**Borderline pass on 3-Condition:**
→ Create proposal with note about weak condition

**Pattern spans multiple types:**
→ Create single proposal noting the cross-type nature

## Dry Run Output

```markdown
## Review Preview (Dry Run)

Would create [N] proposals:

### 1. [name]
- Type: [type]
- Observations: [N]
- 3-Condition: PASS

### 2. [name]
- Type: [type]
- Observations: [N]
- 3-Condition: PASS

Run without --dry-run to create these proposals.
```
