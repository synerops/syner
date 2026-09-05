# remove

Removes a store with its contents.

## Input

- `id`: the store.

## Output

An operation reference; its result is the removed store.

## Rules

- Authorization: the principal needs `stores:remove` on the store, checked
  through [permissions/authorize](../../../permissions/authorize/AGENTS.md).
- Contents are removed before the store; a partial failure leaves the store
  `pending` removal, never half-visible.
- Side effect: one [activity](../../../activity/record/AGENTS.md) entry with
  the actor, the store, and the outcome.
- Long-running. It returns an [operation](../../../ops/AGENTS.md) reference at
  once; the removed store arrives through it.
- The acting principal comes from the request context, never from the input.

## Errors

`store not found`, `not authorized`, `removal in progress`.
