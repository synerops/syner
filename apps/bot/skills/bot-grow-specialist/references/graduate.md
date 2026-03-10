# graduate — Proposal → Custom Specialist

Promote a mature proposal to custom specialist.

## When to Use

- Proposal has 5+ consultations
- Scope is stable (hasn't changed in 3+ refinements)
- 3-Condition Test passes
- Real value demonstrated

## Input

```bash
/bot-grow-specialist graduate tone-adapter
/bot-grow-specialist graduate handoff-router --force
```

### Flags

| Flag | Description | Default |
|------|-------------|---------|
| `--force` | Skip threshold validation | false |

## Process

### 1. Load Proposal

Read `.syner/ops/bot-grow-specialist/proposals/{name}.md`

### 2. Validate Thresholds

Check:
- [ ] Consultations >= 5 (or --force)
- [ ] Scope stable (no changes in last 3 consultations)
- [ ] 3-Condition Test marked as passing

If validation fails, show what's missing and exit.

### 3. Apply 3-Condition Test (Re-validate)

```markdown
✅ 1. Requires JUDGMENT, not information
   Can coding agent with Read/Grep solve this? NO
   Evidence: {cite why this needs judgment}

✅ 2. Is RECURRING, not one-off
   Appears across multiple conversations? YES
   Evidence: {count} conversations affected

✅ 3. Has CONCRETE evidence
   Specific moments where this friction occurred? YES
   Evidence: {list dates/conversations}
```

### 4. Create Specialist File

Location: `.syner/artifacts/bot-grow-specialist/specialists/{name}.md`

```markdown
# {name}

**Status:** Custom Specialist (L2)
**Graduated:** {date}
**Origin:** Proposal from {original date}

## Purpose

{One sentence - what this specialist does}

## When to Consult

{Specific triggers - when should this be invoked}

## Methodology

{How this specialist approaches the problem}

## Examples

{Real examples from proposal evidence}

### Example 1: {title}
- Situation: {what happened}
- Without specialist: {what went wrong}
- With specialist: {what would have been better}

### Example 2: {title}
...

## Integration Points

{How this connects to bot systems}

- Conversation flow: {how it affects}
- Response generation: {how it affects}
- Handoff logic: {how it affects}

## Metrics

- Consultations before graduation: {count}
- Conversations affected: {estimated count}
- Primary friction type: {type}

## Evolution History

- {date}: Observed first friction
- {date}: Proposal created
- {date}: Graduated to specialist
```

### 5. Archive Proposal

Move to `.syner/ops/bot-grow-specialist/archive/{name}.md`

Add header:
```markdown
---
archived: {date}
reason: Graduated to specialist
location: .syner/artifacts/bot-grow-specialist/specialists/{name}.md
---
```

### 6. Update Tracking

```markdown
## {name}
Level: L2 (Specialist)
Graduated: {date}
Interactions: 0
Path: .syner/artifacts/bot-grow-specialist/specialists/{name}.md
```

### 7. Output Confirmation

```
Graduated: {name}

From: Proposal (L1)
To: Custom Specialist (L2)

File: .syner/artifacts/bot-grow-specialist/specialists/{name}.md

Stats:
  Observations: {count}
  Consultations: {count}
  Time to graduation: {days} days

Next:
  - Specialist will be consulted during bot work
  - After 10+ interactions, consider promotion to subagent
  - Run `/bot-grow-specialist status {name}` to track progress
```

## Graduation Criteria Checklist

Before graduating, verify:

- [ ] **Threshold met**: 5+ consultations (or justified --force)
- [ ] **Scope stable**: No changes in last 3 refinements
- [ ] **3-Condition Test**: All three conditions pass
- [ ] **Real examples**: Concrete conversations cited
- [ ] **Clear methodology**: Can describe how it works
- [ ] **Integration points**: Know where it connects

## What Makes a Good Specialist

### Clear scope
One sentence that anyone can understand.

### Concrete methodology
Not "figure out the right thing" but specific steps.

### Real examples
From actual conversations, not hypothetical.

### Integration clarity
Knows exactly where it fits in bot architecture.

## Output Template

```
[If validation passes:]
Graduated: [name]

From: Proposal (L1)
To: Custom Specialist (L2)

File: .syner/artifacts/bot-grow-specialist/specialists/[name].md

Stats:
  Observations: [count]
  Consultations: [count]
  Time to graduation: [days] days

[If validation fails:]
Cannot graduate: [name]

Missing requirements:
  - [ ] Consultations: [count]/5 needed
  - [ ] Scope stability: Changed [N] refinements ago
  - [ ] 3-Condition Test: [which condition fails]

Run `/bot-grow-specialist refine [name]` to continue maturing.
```
