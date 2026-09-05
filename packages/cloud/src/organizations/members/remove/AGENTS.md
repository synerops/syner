# remove

Removes a principal from an organization.

## Input

- `organizationId`: the organization.
- `principalId`: who.

## Output

Nothing but confirmation.

## Rules

- Authorization: the principal needs `members:remove` on the organization,
  checked through
  [permissions/authorize](../../../permissions/authorize/AGENTS.md).
- The last owner cannot be removed.
- Permissions and delegations tied to the membership are revoked in the same
  request.
- Side effect: one [activity](../../../activity/record/AGENTS.md) entry with
  the actor, the former member, and the outcome.
- Runs in-request. It returns confirmation, not an
  [operation](../../../ops/AGENTS.md).
- The acting principal comes from the request context, never from the input.

## Errors

`organization not found`, `member not found`, `not authorized`, `last owner`.
