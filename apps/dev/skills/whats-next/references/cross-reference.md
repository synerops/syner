# Cross-Reference Logic

Connect items across sources to identify patterns and consolidate work.

## Relationship Types

### Friction → Backlog
A friction observation describes the same problem as a backlog item.

**Match signals:**
- Similar keywords (e.g., "auth flow" in both)
- Same file/path referenced
- Same domain (bot, notes, dev)

**Action:** Friction validates the backlog item's importance. Increase priority.

### Friction → Task
A friction observation describes something actively being worked on.

**Match signals:**
- Same area of code
- Same feature name
- Task description addresses the friction

**Action:** Note the connection. Task may already resolve the friction.

### Backlog → Issue
A backlog item has been promoted to a GitHub issue.

**Match signals:**
- Issue title matches backlog item
- Issue body references backlog
- Same unique identifier

**Action:** Mark backlog item as "tracked" with issue reference.

### Task → Issue
A task is associated with an open issue.

**Match signals:**
- Task references issue number (#123)
- Issue is assigned to same owner

**Action:** Link task progress to issue status.

### Friction → Issue
A friction pattern has already been reported as an issue.

**Match signals:**
- Issue labels include relevant domain
- Issue title describes the friction

**Action:** Note that friction is being tracked. Don't create duplicate issues.

## Cross-Reference Map

Build a map connecting related items:

```
Pattern: "auth flow problems"
├── Friction: 2024-01-15 bot/observations.md "OAuth token refresh fails"
├── Backlog: apps/bot/vaults/backlog.md "Fix OAuth token handling"
├── Task: .syner/tasks/bot/index.md "Investigating auth issues"
└── Issue: #42 "OAuth tokens expire unexpectedly"
```

## Consolidation Rules

1. **One canonical item per pattern** — If friction, backlog, task, and issue all describe the same thing, the GitHub issue is the source of truth.

2. **Backlog items with issues** — Mark as "Tracked in #X" and reduce priority (work is in progress).

3. **Repeated friction without backlog** — Flag as "needs backlog item" or "needs issue."

4. **Orphaned tasks** — Tasks with no backlog or issue context may indicate undocumented work.

## Relationship Scoring

Each relationship type adds to the item's priority score:

| Relationship | Points |
|--------------|--------|
| Friction validates backlog | +3 |
| Backlog has active task | +2 |
| Backlog has open issue | +2 |
| Multiple frictions same pattern | +5 per additional |
| Cross-domain friction | +3 |
