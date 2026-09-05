# create

Creates a store and drives it to ready.

## Input

- `organizationId`: the owner.
- `name`: unique in the organization.
- `appId`: optional.

## Output

An operation reference; its result is the store, ready.

## Rules

- Authorization: the principal needs `stores:create` on the organization, or
  the app when given, checked through
  [permissions/authorize](../../../permissions/authorize/AGENTS.md).
- When the principal is an agent acting under a delegation, the check applies
  to the human's permissions, never to a wider set.
- Side effect: one [activity](../../../activity/record/AGENTS.md) entry with
  the actor, the store, and the outcome.
- Long-running. It returns an [operation](../../../ops/AGENTS.md) reference at
  once; the store arrives through it.
- The acting principal comes from the request context, never from the input.

## Errors

`organization not found`, `app not found`, `not authorized`, `name taken`.
