# grant

Adds a grant of use to a connection.

## Input

- `id`: the connection.
- `appId or principalId`: exactly one.

## Output

The connection with its grants.

## Rules

- Authorization: the principal needs `connections:grant` on the connection,
  checked through
  [permissions/authorize](../../permissions/authorize/AGENTS.md).
- Granting to a principal that is an agent requires the agent's delegating
  human to hold the same grant, or the grant is refused.
- A duplicate grant changes nothing and returns the connection as it is.
- Side effect: one [activity](../../activity/record/AGENTS.md) entry with the
  actor, the connection and the grantee, and the outcome.
- Runs in-request. It returns the connection, not an
  [operation](../../ops/AGENTS.md).
- The acting principal comes from the request context, never from the input.

## Errors

- `connection not found`
- `app not found`
- `principal not found`
- `not authorized`
