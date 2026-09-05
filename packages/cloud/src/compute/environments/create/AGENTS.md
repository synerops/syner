# create

Allocates an environment and drives it to ready.

## Input

- `organizationId`: the owner.
- `runtime`: a named runtime.
- `resources`: optional; defaults apply.
- `lifetime`: optional; `ephemeral` by default.

## Output

An operation reference; its result is the environment, ready or failed.

## Rules

- Authorization: the principal needs `environments:create` on the
  organization, checked through
  [permissions/authorize](../../../permissions/authorize/AGENTS.md).
- When the principal is an agent acting under a delegation, the check applies
  to the human's permissions, never to a wider set.
- Side effect: one [activity](../../../activity/record/AGENTS.md) entry with
  the actor, the environment, and the outcome.
- Long-running. It returns an [operation](../../../ops/AGENTS.md) reference at
  once; the environment arrives through it.
- The acting principal comes from the request context, never from the input.

## Errors

`organization not found`, `not authorized`, `unknown runtime`, `resources unavailable`.
