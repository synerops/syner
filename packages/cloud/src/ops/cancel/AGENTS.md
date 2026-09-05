# cancel

Requests cancellation of a pending or running operation.

## Input

- `id`: the operation.

## Output

The operation with status `cancelled`, or its current final status if it had
already ended.

## Rules

- Authorization: the principal needs `ops:cancel` on the operation's resource,
  checked through
  [permissions/authorize](../../permissions/authorize/AGENTS.md).
- The creating verb defines what a safe stop means; an operation that cannot
  stop safely completes and says so.
- Cancelling a finished operation changes nothing.
- Side effect: one [activity](../../activity/record/AGENTS.md) entry with the
  actor, the operation, and the outcome.
- Runs in-request. It returns the operation, not an
  [operation](../../ops/AGENTS.md).
- The acting principal comes from the request context, never from the input.

## Errors

`operation not found`, `not authorized`.
