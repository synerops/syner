# review — Detect patterns in observations

Analyze accumulated observations and propose specialists for recurring patterns.

## When to Use

- After 3+ observations of same type
- Weekly check-in
- Before planning bot improvements

## Input

```bash
/bot-grow-specialist review
/bot-grow-specialist review --threshold 2
/bot-grow-specialist review --type response
```

### Flags

| Flag | Description | Default |
|------|-------------|---------|
| `--threshold` | Minimum observations to propose | 3 |
| `--type` | Focus on specific friction type | All |

## Process

### 1. Load Observations

Read `.syner/ops/bot-grow-specialist/observations.md`

### 2. Group by Pattern

Cluster observations by:
- Friction type
- Similar context
- Similar "would have helped"

### 3. Count Occurrences

For each pattern:
- Count observations
- Check if >= threshold
- Note date range

### 4. Apply 3-Condition Test

For patterns meeting threshold:

```markdown
✅ 1. Requires JUDGMENT, not information
   Can coding agent with Read/Grep solve this?

✅ 2. Is RECURRING, not one-off
   Appears across multiple conversations?

✅ 3. Has CONCRETE evidence
   Specific conversations where this friction occurred?
```

### 5. Create Proposals

For passing patterns, create proposal file:

Location: `.syner/ops/bot-grow-specialist/proposals/{name}.md`

```markdown
# {name}

**Status:** Proposal (L1)
**Created:** {date}
**Observations:** {count}

## Scope

{One sentence describing what this specialist does}

## Evidence

{List of observations with dates}

## Proposed Solution

{Initial shape of solution}

## 3-Condition Test

- [x] Requires judgment (not just grep)
- [x] Is recurring (3+ times)
- [x] Has concrete evidence

## Consultations

- {date}: Created from review
```

### 6. Update Tracking

Add to `.syner/ops/bot-grow-specialist/tracking.md`:

```markdown
## {name}
Level: L1 (Proposal)
Created: {date}
Observations: {count}
Consultations: 1
```

### 7. Output Summary

```
Review complete.

Patterns detected: [N]

New proposals:
  - tone-adapter (4 observations, response friction)
  - handoff-router (3 observations, handoff friction)

Existing proposals updated:
  - context-keeper (now 5 observations)

Below threshold:
  - integration (2 observations, needs 1 more)

Run `/bot-grow-specialist status` to see full state.
```

## Pattern Detection Heuristics

Look for:
- Same friction type repeated
- Similar "would have helped" phrases
- Same conversation phase (intro, qualification, close)
- Same lead type (enterprise, SMB, etc.)

## Proposal Naming

Use descriptive, action-oriented names:
- `tone-adapter` (adapts tone based on lead signals)
- `handoff-router` (routes escalations correctly)
- `context-keeper` (maintains conversation context)
- `qualification-scorer` (scores lead quality)

Avoid:
- Generic names (`helper`, `manager`)
- Implementation names (`ml-model`, `api-wrapper`)

## Output Template

```
Review complete.

Patterns detected: [N]

[For each new proposal:]
New proposal: [name]
  Type: [friction type]
  Observations: [count]
  Date range: [first] - [last]
  File: .syner/ops/bot-grow-specialist/proposals/[name].md

[For each updated:]
Updated: [name]
  Now has [count] observations

[For each below threshold:]
Below threshold: [type]
  Observations: [count]
  Needs: [threshold - count] more

Next steps:
  - Refine proposals with `/bot-grow-specialist refine [name]`
  - Graduate mature proposals with `/bot-grow-specialist graduate [name]`
```
