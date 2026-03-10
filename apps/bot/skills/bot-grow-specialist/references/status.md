# status — View evolution state

Show current state of all specialists at all levels.

## When to Use

- Check progress anytime
- Weekly overview
- See what's ready for graduation/promotion
- Understand ecosystem health

## Input

```bash
/bot-grow-specialist status
/bot-grow-specialist status tone-adapter
/bot-grow-specialist status --ready
/bot-grow-specialist status --level L1
/bot-grow-specialist status --stats
```

### Flags

| Flag | Description | Default |
|------|-------------|---------|
| `--ready` | Show only items ready for advancement | false |
| `--level` | Show specific level (L0/L1/L2/L3) | All |
| `--stats` | Show statistics and metrics | false |
| `{name}` | Show details for specific item | None |

## Process

### 1. Load All Data

Gather from:
- `.syner/ops/bot-grow-specialist/observations.md`
- `.syner/ops/bot-grow-specialist/tracking.md`
- `.syner/ops/bot-grow-specialist/proposals/`
- `.syner/artifacts/bot-grow-specialist/specialists/`
- `apps/bot/agents/`

### 2. Build Dashboard

```
Bot Grow Specialist Status
══════════════════════════

L0: Observations
──────────────────
Total: {count}
By type:
  conversation:  {n} ████░░░░░░
  response:      {n} ██████░░░░
  integration:   {n} ██░░░░░░░░
  handoff:       {n} ███░░░░░░░
  context:       {n} █░░░░░░░░░
  qualification: {n} ████░░░░░░

Patterns detected: {count}
  - {type}: {n} observations (threshold: 3)

L1: Proposals
──────────────────
Active: {count}

  {name}
    Observations: {n}
    Consultations: {n}/5
    Last refined: {date}
    Status: {ready/needs work}

  {name}
    ...

L2: Custom Specialists
──────────────────
Active: {count}

  {name}
    Interactions: {n}/10
    Last invoked: {date}
    Status: {ready for promotion/active}

  {name}
    ...

L3: Subagents
──────────────────
Active: {count}

  {name}
    Location: apps/bot/agents/{name}.md
    Promoted: {date}
    Status: Active

  {name}
    ...

Ready for Advancement
──────────────────
  → Graduate: {name} (5+ consultations)
  → Promote: {name} (10+ interactions)

Health
──────────────────
  Stale proposals: {count}
  Coverage gaps: {types}
  Last audit: {date}
```

### 3. Specific Item View (if name provided)

```
{name}
══════════════════════════

Level: {L0/L1/L2/L3}
Status: {status}
Created: {date}

Journey:
  {date}: First observation
  {date}: Proposal created
  {date}: Graduated (if applicable)
  {date}: Promoted (if applicable)

Metrics:
  Observations: {n}
  Consultations: {n}
  Interactions: {n}

Scope:
  {scope statement}

Evidence:
  - {date}: {example 1}
  - {date}: {example 2}
  ...

Next step:
  {what needs to happen to advance}
```

### 4. Ready View (if --ready)

```
Ready for Advancement
══════════════════════════

Graduate to Specialist (L1 → L2):
  {name}
    Consultations: {n} (threshold: 5)
    Scope: {scope}
    Command: /bot-grow-specialist graduate {name}

Promote to Subagent (L2 → L3):
  {name}
    Interactions: {n} (threshold: 10)
    Scope: {scope}
    Command: /bot-grow-specialist promote {name}
```

### 5. Stats View (if --stats)

```
Statistics
══════════════════════════

Total items: {count}
  L0 Observations: {count}
  L1 Proposals: {count}
  L2 Specialists: {count}
  L3 Subagents: {count}

Conversion rates:
  Observation → Proposal: {%}
  Proposal → Specialist: {%}
  Specialist → Subagent: {%}

Time metrics:
  Avg time to proposal: {days} days
  Avg time to specialist: {days} days
  Avg time to subagent: {days} days

Activity:
  Observations this week: {count}
  Consultations this week: {count}
  Last advancement: {date} ({name})

Coverage:
  Types with full pipeline: {list}
  Types with gaps: {list}
```

## Dashboard Symbols

```
████████░░  80% progress
░░░░░░░░░░  0% progress
✓           Ready for advancement
○           In progress
×           Stale/needs attention
```

## Output Template

```
[Default view - dashboard]

[If --ready:]
Ready for Advancement
══════════════════════════
[List items ready to advance with commands]

[If specific name:]
{name} Details
══════════════════════════
[Full details for that item]

[If --stats:]
Statistics
══════════════════════════
[Metrics and conversion rates]
```
