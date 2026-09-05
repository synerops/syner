# get

Reads the budget of a scope with its consumption in the current period.

## Input

- `organizationId`: required.
- `appId`: optional.

## Output

The budget, `current` consumption, and `remaining`.

## Rules

- Authorization: the principal needs `budgets:read` on the organization, or
  the app when given, checked through
  [permissions/authorize](../../../permissions/authorize/AGENTS.md).
- Runs in-request. It returns the budget, not an
  [operation](../../../ops/AGENTS.md).
- The acting principal comes from the request context, never from the input.

## Errors

`organization not found`, `app not found`, `budget not set`, `not authorized`.
