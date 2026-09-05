# remove

Stops an environment and releases its resources.

## Input

- `id`: the environment.

## Output

An operation reference; its result is the stopped environment.

## Rules

- Authorization: the principal needs `environments:remove` on the environment,
  checked through
  [permissions/authorize](../../../permissions/authorize/AGENTS.md).
- Running executions in it are cancelled first.
- Side effect: one [activity](../../../activity/record/AGENTS.md) entry with
  the actor, the environment, and the outcome.
- Long-running. It returns an [operation](../../../ops/AGENTS.md) reference at
  once; the stopped environment arrives through it.
- The acting principal comes from the request context, never from the input.

## Errors

`environment not found`, `not authorized`, `already stopped`.
