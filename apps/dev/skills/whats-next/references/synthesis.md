# Synthesis Logic

Transform raw data from all sources into opinionated recommendations.

## Synthesis Goals

1. **First move** — What single action has highest impact right now?
2. **Focus area** — Which domain needs most attention?
3. **Decisions needed** — What's blocked waiting for human input?
4. **Pattern recognition** — What themes emerge across sources?

## First Move Selection

The "first move" is the single most important action. Select it by:

1. Find the top item from the ordered priority criteria
2. If multiple items tie at top, prefer:
   - Items that unblock other work
   - Items with clear, concrete next steps
   - Items the user mentioned recently
3. Express as an action: "Fix X" not "X is broken"

**Format:**
```
**[Action verb] [specific thing]** — [Why this unblocks progress or matters]
```

**Examples:**
- "Merge #42 OAuth fix — Unblocks 3 other issues waiting on auth"
- "Decide on state management approach — 2 tasks blocked pending this decision"
- "Create issue for repeated gh auth friction — Observed 5 times this week, no tracking"

## Focus Area Analysis

Identify which domain (bot, notes, dev) has the most signals:

1. Count items per domain across all sources
2. Weight by priority bucket (top priority = 3, this week = 2, later = 1)
3. Domain with highest weighted count = focus area

**Format:**
```
**[Domain]** has [N] signals this week ([X] frictions, [Y] backlog items, [Z] issues).
Consider dedicating focused time to clear the queue.
```

## Decision Identification

Find items blocked on decisions:

1. Issues with `needs-decision` label
2. Backlog items marked "blocked" or "waiting for decision"
3. Friction observations describing confusion about approach

**Format:**
```
| Issue | Title | Days Waiting | Impact |
|-------|-------|--------------|--------|
```

## Pattern Recognition

Group related items into patterns:

1. Cluster by keyword similarity
2. Cluster by affected files/paths
3. Cluster by domain
4. Name each cluster with a brief theme

**Format:**
```
**Pattern: [theme]**
- [Source]: [item description]
- [Source]: [item description]
Priority: [Top priority/This week/Later]
```

## Synthesis Rules

1. **Be opinionated** — Don't just list items. Say what matters most.
2. **Be specific** — "Fix OAuth" not "Address auth issues"
3. **Connect the dots** — Show how items relate
4. **Acknowledge uncertainty** — If sources conflict, say so
5. **Proportional context** — More detail for top-priority items, less for later items

## Anti-Patterns

- Listing everything without prioritization
- Vague recommendations ("look into auth")
- Ignoring relationships between sources
- Treating all items as equally important
- Recommending work on blocked items
