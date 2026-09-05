# create

Registers a connection without a credential.

## Input

- `organizationId`: the owner.
- `name`: unique in the organization.
- `service`: a named kind.
- `config`: non-secret settings.

## Output

The connection with `credentialSetAt` empty and no grants.

## Rules

- Authorization: the principal needs `connections:create` on the organization,
  checked through
  [permissions/authorize](../../permissions/authorize/AGENTS.md).
- When the principal is an agent acting under a delegation, the check applies
  to the human's permissions, never to a wider set.
- Validation: `config` carries no field the service marks as secret; such a
  field is rejected.
- Side effect: one [activity](../../activity/record/AGENTS.md) entry with the
  actor, the connection, and the outcome.
- Runs in-request. It returns the connection, not an
  [operation](../../ops/AGENTS.md).
- The acting principal comes from the request context, never from the input.

## Errors

- `organization not found`
- `not authorized`
- `name taken`
- `unknown service`
- `secret in config`
