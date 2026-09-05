# grant

Adds an explicit permission.

## Input

- `principalId`: who.
- `action`: a known action name.
- `resource`: kind and id.

## Output

The permission.

## Rules

- Authorization: the actor holds `permissions:grant` on the resource's
  organization and holds the action being granted.
- A permission already implied by the principal's role is accepted and
  recorded as a grant anyway, so it survives a role change.
- Side effect: one [activity](../../activity/record/AGENTS.md) entry with the
  actor, the principal, the action, and the resource, and the outcome.
- Runs in-request. It returns the permission, not an
  [operation](../../ops/AGENTS.md).
- The acting principal comes from the request context, never from the input.

## Errors

- `principal not found`
- `resource not found`
- `unknown action`
- `not authorized`
