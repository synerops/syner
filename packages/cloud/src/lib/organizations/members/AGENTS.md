# members

Owns membership: principal, role, and when it was granted.

## Model (`member.ts`)

- `organizationId`: the organization.
- `principalId`: the member.
- `role`: `owner`, `admin`, `member`, `viewer`.
- `addedBy, addedAt`: principal and timestamp.

## Rules

- The last owner cannot be removed or demoted.
- A principal holds one role per organization; adding again with another role
  replaces it.
- Removing a member revokes the permissions and delegations tied to that
  membership.

## Use cases

### `add.ts`

Adds a principal to an organization with a role, or changes their role.

- Granting `owner` requires the actor to be an owner.
- Side effect: one [activity](../../activity/AGENTS.md) entry with the actor,
  the member and the role, and the outcome.

### `remove.ts`

Removes a principal from an organization.

- The last owner cannot be removed.
- Permissions and delegations tied to the membership are revoked in the same
  request.
- Side effect: one [activity](../../activity/AGENTS.md) entry with the actor,
  the former member, and the outcome.

### `list.ts`

Lists the members of an organization, paged.

## Exposure

Public location pending for `add`, `remove`, `list`: see
[api](../../../api/AGENTS.md). Nothing under `api/` exists for it yet.
