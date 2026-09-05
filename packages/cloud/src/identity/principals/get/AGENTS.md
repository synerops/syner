# get

Reads one principal.

## Input

- `id`: the principal.

## Output

The principal.

## Rules

- Authorization: the principal needs `principals:read` on an organization both
  share, checked through
  [permissions/authorize](../../../permissions/authorize/AGENTS.md).
- Runs in-request. It returns the principal, not an
  [operation](../../../ops/AGENTS.md).
- The acting principal comes from the request context, never from the input.

## Errors

`principal not found`, `not authorized`.
