# delegations

Owns delegations: who acts for whom, within what scope, until when.

## Schema (index)

- `id`: stable.
- `fromPrincipalId`: a human.
- `toPrincipalId`: an agent.
- `scope`: `organizationId` and optional `appId`.
- `limits`: `all` or a list of permission names.
- `expiresAt`: timestamp.
- `status`: `active`, `revoked`, `expired`.
- `createdAt, revokedAt`: timestamps.

## Rules

- `from` is a human and `to` is an agent; anything else is rejected.
- The effective permissions of the agent are the human's permissions in the
  scope, intersected with `limits`.
- Revocation is immediate; an in-flight call completes, the next is refused.
- An expired delegation is never reactivated; a new one is created.

## Verbs

- [create](create/AGENTS.md): delegates to an agent
- [revoke](revoke/AGENTS.md): ends it now
- [get](get/AGENTS.md): returns the delegation
- [list](list/AGENTS.md): returns delegations in the organization
