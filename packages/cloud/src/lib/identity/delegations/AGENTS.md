# delegations

Owns delegations: who acts for whom, within what scope, until when.

## Model (`delegation.ts`)

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

## Use cases

### `create.ts`

Creates a delegation from the acting human to an agent.

- `limits` may only name permissions the human holds; others are rejected.
- Side effect: one [activity](../../activity/AGENTS.md) entry with the actor,
  the delegation, the agent, and the scope, and the outcome.

### `revoke.ts`

Revokes a delegation.

- Side effect: one [activity](../../activity/AGENTS.md) entry with the actor,
  the delegation, and the outcome.

### `get.ts`

Reads one delegation.

### `list.ts`

Lists delegations of an organization, paged.

## Exposure

Public location pending for `create`, `revoke`, `get`, `list`: see
[api](../../../api/AGENTS.md). Nothing under `api/` exists for it yet.
