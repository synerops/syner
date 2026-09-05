# start

Starts an execution of a command, allocating an environment when none is
given.

## Input

- `environmentId`: optional; when absent an ephemeral environment is
  allocated.
- `command`: required.
- `input`: optional.
- `runtime, resources`: used only when allocating implicitly.

## Output

The execution with status `queued` or `running`.

## Rules

- Authorization: the principal needs `executions:start` on the environment, or
  the organization when allocating, checked through
  [permissions/authorize](../../../permissions/authorize/AGENTS.md).
- When the principal is an agent acting under a delegation, the check applies
  to the human's permissions, never to a wider set.
- A stopped environment is refused; nothing is allocated in its place.
- Side effect: one [activity](../../../activity/record/AGENTS.md) entry with
  the actor, the execution and its environment, and the outcome.
- Returns the execution itself, which carries its own status; no operation is
  created.
- The acting principal comes from the request context, never from the input.

## Errors

`environment not found`, `environment stopped`, `not authorized`, `unknown runtime`.
