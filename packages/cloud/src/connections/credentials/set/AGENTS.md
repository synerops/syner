# set

Stores secret material for a connection, replacing any previous material.

## Input

- `connectionId`: the connection.
- `material`: the secret; shape defined by the service.

## Output

The credential status: `setAt` and `fingerprint`.

## Rules

- Authorization: the principal needs `credentials:set` on the connection,
  checked through
  [permissions/authorize](../../../permissions/authorize/AGENTS.md).
- When the principal is an agent acting under a delegation, the check applies
  to the human's permissions, never to a wider set.
- The material goes to the vault and nowhere else; the response never echoes
  it.
- Validation: the material has the shape the service expects; a wrong shape is
  rejected and nothing changes.
- Side effect: one [activity](../../../activity/record/AGENTS.md) entry with
  the actor, the connection; the entry says a credential was set and by whom,
  nothing more, and the outcome.
- Runs in-request. It returns the credential status, not an
  [operation](../../../ops/AGENTS.md).
- The acting principal comes from the request context, never from the input.

## Errors

- `connection not found`
- `not authorized`
- `invalid material`
