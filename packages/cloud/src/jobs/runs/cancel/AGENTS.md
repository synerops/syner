# cancel

Cancels a run.

## Input

- `id`: the run.

## Output

The run with status `cancelled`, or its current final status if it had already
ended.

## Rules

- Authorization: the principal needs `runs:cancel` on the job, checked through
  [permissions/authorize](../../../permissions/authorize/AGENTS.md).
- Cancelling a finished run changes nothing.
- Side effect: one [activity](../../../activity/record/AGENTS.md) entry with
  the actor, the run, and the outcome.
- Runs in-request. It returns the run, not an
  [operation](../../../ops/AGENTS.md).
- The acting principal comes from the request context, never from the input.

## Errors

`run not found`, `not authorized`.
