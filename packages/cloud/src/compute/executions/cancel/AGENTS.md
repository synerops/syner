# cancel

Cancels an execution that is queued or running.

## Input

- `id`: the execution.

## Output

The execution with status `cancelled`, or its current final status if it had
already ended.

## Rules

- Authorization: the principal needs `executions:cancel` on the execution,
  checked through
  [permissions/authorize](../../../permissions/authorize/AGENTS.md).
- Cancelling a finished execution changes nothing and returns it as it is.
- Side effect: one [activity](../../../activity/record/AGENTS.md) entry with
  the actor, the execution, and the outcome.
- Runs in-request. It returns the execution, not an
  [operation](../../../ops/AGENTS.md).
- The acting principal comes from the request context, never from the input.

## Errors

- `execution not found`
- `not authorized`
