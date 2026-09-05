# remove

Removes a job definition and cancels its active runs.

## Input

- `id`: the job.

## Output

Nothing but confirmation.

## Rules

- Authorization: the principal needs `jobs:remove` on the job, checked through
  [permissions/authorize](../../permissions/authorize/AGENTS.md).
- Active runs are cancelled before the definition goes; their status says
  `cancelled` with the removal as reason.
- Side effect: one [activity](../../activity/record/AGENTS.md) entry with the
  actor, the job and the runs cancelled, and the outcome.
- Runs in-request. It returns confirmation, not an
  [operation](../../ops/AGENTS.md).
- The acting principal comes from the request context, never from the input.

## Errors

`job not found`, `not authorized`.
