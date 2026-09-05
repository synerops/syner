# remove

Removes a connection with its grants and credential.

## Input

- `id`: the connection.

## Output

Nothing but confirmation.

## Rules

- Authorization: the principal needs `connections:remove` on the connection,
  checked through
  [permissions/authorize](../../permissions/authorize/AGENTS.md).
- Grants are revoked and the credential destroyed in the same request; there
  is no half-removed connection.
- Side effect: one [activity](../../activity/record/AGENTS.md) entry with the
  actor, the connection and the grants revoked, and the outcome.
- Runs in-request. It returns confirmation, not an
  [operation](../../ops/AGENTS.md).
- The acting principal comes from the request context, never from the input.

## Errors

- `connection not found`
- `not authorized`
