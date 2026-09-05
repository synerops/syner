# get

Reads one environment.

## Input

- `id`: the environment.

## Output

The environment.

## Rules

- Authorization: the principal needs `environments:read` on the environment,
  checked through
  [permissions/authorize](../../../permissions/authorize/AGENTS.md).
- Runs in-request. It returns the environment, not an
  [operation](../../../ops/AGENTS.md).
- The acting principal comes from the request context, never from the input.

## Errors

`environment not found`, `not authorized`.
