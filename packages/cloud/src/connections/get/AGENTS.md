# get

Reads one connection without its credential.

## Input

- `id`: the connection, or
- `organizationId + name`: the pair.

## Output

The connection.

## Rules

- Authorization: the principal needs `connections:read` on the connection,
  checked through
  [permissions/authorize](../../permissions/authorize/AGENTS.md).
- Runs in-request. It returns the connection, not an
  [operation](../../ops/AGENTS.md).
- The acting principal comes from the request context, never from the input.

## Errors

`connection not found`, `not authorized`.
