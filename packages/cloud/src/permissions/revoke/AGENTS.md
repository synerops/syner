# revoke

Removes an explicit permission.

## Input

- `principalId`: who.
- `action`: the action.
- `resource`: kind and id.

## Output

Nothing but confirmation.

## Rules

- Authorization: the actor holds `permissions:revoke` on the resource's
  organization.
- Revoking a grant that does not exist changes nothing.
- Side effect: one [activity](../../activity/record/AGENTS.md) entry with the
  actor, the principal, the action, and the resource, and the outcome.
- Runs in-request. It returns confirmation, not an
  [operation](../../ops/AGENTS.md).
- The acting principal comes from the request context, never from the input.

## Errors

`permission not found`, `not authorized`.
