# set

Creates or replaces the budget of a scope.

## Input

- `organizationId`: required.
- `appId`: optional.
- `limit`: metric and quantity, or cost.
- `period`: required.
- `action`: required.

## Output

The budget with its current consumption.

## Rules

- Authorization: the principal needs `budgets:set` on the organization,
  checked through
  [permissions/authorize](../../../permissions/authorize/AGENTS.md).
- A cost limit is rejected when no pricing provider is configured.
- Side effect: one [activity](../../../activity/record/AGENTS.md) entry with
  the actor, the scope and the limit, and the outcome.
- Runs in-request. It returns the budget, not an
  [operation](../../../ops/AGENTS.md).
- The acting principal comes from the request context, never from the input.

## Errors

- `organization not found`
- `app not found`
- `not authorized`
- `pricing unavailable`
- `invalid limit`
