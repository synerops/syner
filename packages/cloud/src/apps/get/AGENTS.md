# get

Reads one app by id, or by organization and name.

## Input

- `id`: the app id, or
- `organizationId + name`: the pair that identifies it.

## Output

The app, with a summary of its current deployment when it has one.

## Rules

- Authorization: the principal needs `apps:read` on the app, checked through
  [permissions/authorize](../../permissions/authorize/AGENTS.md).
- Runs in-request. It returns the app, not an
  [operation](../../ops/AGENTS.md).
- The acting principal comes from the request context, never from the input.

## Errors

`app not found`, `not authorized`.
