# revoke

Revokes a delegation.

## Input

- `id`: the delegation.

## Output

The delegation with status `revoked`.

## Rules

- Authorization: the delegating human, or an owner of the scope's
  organization.
- Side effect: one [activity](../../../activity/record/AGENTS.md) entry with
  the actor, the delegation, and the outcome.
- Runs in-request. It returns the delegation, not an
  [operation](../../../ops/AGENTS.md).
- The acting principal comes from the request context, never from the input.

## Errors

- `delegation not found`
- `not authorized`
- `already ended`
