# add

Adds a principal to an organization with a role, or changes their role.

## Input

- `organizationId`: the organization.
- `principalId`: who.
- `role`: required.

## Output

The membership.

## Rules

- Authorization: the principal needs `members:add` on the organization,
  checked through
  [permissions/authorize](../../../permissions/authorize/AGENTS.md).
- Granting `owner` requires the actor to be an owner.
- Side effect: one [activity](../../../activity/record/AGENTS.md) entry with
  the actor, the member and the role, and the outcome.
- Runs in-request. It returns the membership, not an
  [operation](../../../ops/AGENTS.md).
- The acting principal comes from the request context, never from the input.

## Errors

`organization not found`, `principal not found`, `not authorized`, `invalid role`.
