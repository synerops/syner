# authorize

Answers allowed or denied for a principal, an action, and a resource.

## Input

- `principalId`: defaults to the acting principal.
- `action`: required.
- `resource`: kind and id.
- `delegationId`: optional; taken from the request context when the actor is
  an agent.

## Output

`allowed` (boolean) and `reason`.

## Rules

- Deny by default.
- For a human: allowed if a role or a grant covers the action on the resource
  or on something that owns it.
- For an agent under delegation: allowed only if the human would be allowed,
  the resource is inside the delegation scope, the action is within its
  limits, and the delegation is active.
- For an agent without delegation: allowed only through the agent's own
  grants; never through a human's.
- A disabled principal is denied whatever else holds.
- Denials are recorded in [activity](../../activity/record/AGENTS.md); allowed
  decisions are not, the action itself is.
- Runs in-request. It returns the decision, not an
  [operation](../../ops/AGENTS.md).
- The acting principal comes from the request context, never from the input.

## Errors

- `principal not found`
- `resource not found`
- `unknown action`
