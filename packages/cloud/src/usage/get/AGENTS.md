# get

Aggregates usage records over a period.

## Input

- `organizationId`: required.
- `appId, principalId, metric`: optional filters.
- `since, until`: the window.
- `by`: `metric`, `app`, `principal`, or `day`.

## Output

Rows of `key`, `quantity`, and `cost` when pricing is configured.

## Rules

- Authorization: the principal needs `usage:read` on the organization, or the
  app when given, checked through
  [permissions/authorize](../../permissions/authorize/AGENTS.md).
- Cost is computed on read through the pricing provider; absent pricing, rows
  carry quantity only.
- Runs in-request. It returns the aggregate, not an
  [operation](../../ops/AGENTS.md).
- The acting principal comes from the request context, never from the input.

## Errors

- `organization not found`
- `app not found`
- `not authorized`
- `invalid window`
