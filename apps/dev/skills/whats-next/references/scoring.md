# Prioritization Criteria

Order items by applying these criteria in sequence. The first criterion that distinguishes two items determines which comes first.

## Ordered Criteria

1. **Needs decision** — Has `needs-decision` label or is blocked waiting for human input. Always comes first; nothing else can move until a decision is made.

2. **Blocks other work** — Resolving this unblocks one or more other in-progress items. Prefer items that unblock more work.

3. **Recurring friction** — Observed in `.syner/ops/` in the last 7 days. More observations = higher priority.

4. **Age** — Older unresolved items before newer ones. Items open more than 7 days signal neglect.

5. **Effort** — When all else is equal, prefer lower-effort items (quick wins keep momentum).

## Priority Buckets

After ordering, group items into three buckets — use model judgment for cut-offs based on the signals present:

- **Top priority** — Do today. Items clearly distinguished by criteria 1–3.
- **This week** — Plan to address. Items with moderate signals.
- **Later** — Schedule or backlog. Items with few signals.

## Tie-Breaking

When two items are equal across all criteria:

1. **Recency** — More recent friction first
2. **Specificity** — More concrete items over vague ones

## Urgency Overrides

These always jump to top priority regardless of other criteria:

- Failed build or test blocking deploys
- Security concern
- User mentioned it in this session
