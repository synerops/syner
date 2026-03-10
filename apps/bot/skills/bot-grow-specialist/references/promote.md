# promote — Custom Specialist → Subagent

Elevate a critical specialist to autonomous subagent.

## When to Use

- Specialist has 10+ interactions
- Critical for bot operation (would miss it if gone)
- Can define own execution (tools, boundaries)
- Ready for autonomy

## Input

```bash
/bot-grow-specialist promote tone-adapter
/bot-grow-specialist promote handoff-router --force
```

### Flags

| Flag | Description | Default |
|------|-------------|---------|
| `--force` | Skip threshold validation | false |

## Process

### 1. Load Specialist

Read `.syner/artifacts/bot-grow-specialist/specialists/{name}.md`

### 2. Validate Criticality

Check:
- [ ] Interactions >= 10 (or --force)
- [ ] Critical assessment: Would bot suffer without this?
- [ ] Autonomy ready: Can define tools and execution

### 3. Assess Autonomy Readiness

Ask:
```
Can this specialist:
1. Define its own tools? (Read, Write, Bash, APIs, etc.)
2. Execute without human guidance?
3. Know its own boundaries?
4. Produce concrete output?
```

All must be YES.

### 4. Create Subagent File

Location: `apps/bot/agents/{name}.md`

```markdown
---
name: {name}
description: {one-line description for agent selection}
metadata:
  author: bot
  version: "1.0.0"
  origin: bot-grow-specialist
  graduated: {date}
  background: false
tools: [{determined from methodology}]
---

# {Name}

{Purpose statement from specialist}

## When to Invoke

{Specific triggers - matches agent routing criteria}

## Methodology

{Detailed methodology from specialist, expanded for autonomous execution}

## Tools

{List tools with justification}

| Tool | Purpose |
|------|---------|
| Read | {why needed} |
| Write | {why needed} |
| ... | ... |

## Execution Steps

{Step-by-step process this agent follows}

1. {First step}
2. {Second step}
3. ...

## Boundaries

{What this agent does NOT do}

- Does not: {boundary 1}
- Does not: {boundary 2}
- Routes to: {other agent} when {condition}

## Examples

{Expanded examples showing autonomous execution}

### Example 1: {title}

**Input:** {what triggers this}
**Process:** {what agent does}
**Output:** {what agent produces}

## Metrics

{From specialist history}

- Origin: Observation on {date}
- Graduated to specialist: {date}
- Promoted to subagent: {date}
- Total interactions before promotion: {count}

## Evolution Notes

{Key learnings from the journey}

- Started as: {original friction}
- Evolved to: {final capability}
- Key refinements: {what changed scope}
```

### 5. Archive Specialist

Move to `.syner/artifacts/bot-grow-specialist/archive/{name}.md`

Add header:
```markdown
---
archived: {date}
reason: Promoted to subagent
location: apps/bot/agents/{name}.md
---
```

### 6. Update Tracking

```markdown
## {name}
Level: L3 (Subagent)
Promoted: {date}
Path: apps/bot/agents/{name}.md
Status: Active
```

### 7. Output Confirmation

```
Promoted: {name}

From: Custom Specialist (L2)
To: Subagent (L3)

File: apps/bot/agents/{name}.md

Journey:
  First observation: {date}
  Proposal created: {date}
  Graduated to specialist: {date}
  Promoted to subagent: {date}
  Total time: {days} days
  Total interactions: {count}

The specialist is now an autonomous agent available for routing.
```

## Promotion Criteria Checklist

Before promoting, verify:

- [ ] **Threshold met**: 10+ interactions (or justified --force)
- [ ] **Critical**: Bot would suffer without this
- [ ] **Tools defined**: Know exactly what tools needed
- [ ] **Boundaries clear**: Know what it does NOT do
- [ ] **Execution steps**: Can run autonomously
- [ ] **Routing criteria**: Know when to invoke

## What Makes a Good Subagent

### Autonomy
Can execute without human guidance for its domain.

### Boundaries
Knows exactly where its responsibility ends.

### Routing clarity
Agent router knows exactly when to invoke this.

### Concrete output
Produces something tangible, not just "advice".

## Output Template

```
[If validation passes:]
Promoted: [name]

From: Custom Specialist (L2)
To: Subagent (L3)

File: apps/bot/agents/[name].md

Journey:
  First observation: [date]
  Promoted to subagent: [date]
  Total time: [days] days
  Total interactions: [count]

[If validation fails:]
Cannot promote: [name]

Missing requirements:
  - [ ] Interactions: [count]/10 needed
  - [ ] Criticality: Not yet proven critical
  - [ ] Autonomy: Cannot define [tools/boundaries/execution]

Run `/bot-grow-specialist status [name]` to track progress.
```
