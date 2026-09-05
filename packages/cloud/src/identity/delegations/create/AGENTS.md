# create

Creates a delegation from the acting human to an agent.

## Input

- `toPrincipalId`: an agent.
- `scope`: organization and optional app.
- `limits`: `all` or permission names.
- `expiresAt`: required.

## Output

The delegation.

## Rules

- Authorization: the acting principal is a human and a member of the scope's
  organization; agents cannot delegate.
- `limits` may only name permissions the human holds; others are rejected.
- Side effect: one [activity](../../../activity/record/AGENTS.md) entry with
  the actor, the delegation, the agent, and the scope, and the outcome.
- Runs in-request. It returns the delegation, not an
  [operation](../../../ops/AGENTS.md).
- The acting principal comes from the request context, never from the input.

## Errors

- `principal not found`
- `not an agent`
- `not authorized`
- `invalid scope`
- `invalid limits`
