# revoke

Removes a grant of use from a connection.

## Input

- `id`: the connection.
- `appId or principalId`: exactly one.

## Output

The connection with its remaining grants.

## Rules

- Authorization: the principal needs `connections:revoke` on the connection,
  checked through
  [permissions/authorize](../../permissions/authorize/AGENTS.md).
- Revoking a grant that does not exist changes nothing and returns the
  connection as it is.
- Side effect: one [activity](../../activity/record/AGENTS.md) entry with the
  actor, the connection and the former grantee, and the outcome.
- Runs in-request. It returns the connection, not an
  [operation](../../ops/AGENTS.md).
- The acting principal comes from the request context, never from the input.

## Errors

- `connection not found`
- `not authorized`
