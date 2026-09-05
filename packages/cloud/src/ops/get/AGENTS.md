# get

Reads one operation.

## Input

- `id`: the operation.

## Output

The operation.

## Rules

- Authorization: the principal needs `ops:read` on the operation's resource,
  checked through
  [permissions/authorize](../../permissions/authorize/AGENTS.md).
- Runs in-request. It returns the operation, not an
  [operation](../../ops/AGENTS.md).
- The acting principal comes from the request context, never from the input.

## Errors

- `operation not found`
- `not authorized`
