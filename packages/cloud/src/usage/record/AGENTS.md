# record

Appends one usage record.

## Input

- `metric`: from the fixed list.
- `quantity`: number.
- `organizationId`: required.
- `appId, principalId`: optional.
- `resource`: kind and id.

## Output

The record.

## Rules

- Authorization: internal; only cloud use cases and the worker call it. The
  API exposes no route for it.
- After the append, budgets in scope are checked; reaching one triggers its
  action and an [activity](../../activity/record/AGENTS.md) entry.
- Runs in-request. It returns the record, not an
  [operation](../../ops/AGENTS.md).
- The acting principal comes from the request context, never from the input.

## Errors

- `unknown metric`
- `invalid quantity`
- `organization not found`
