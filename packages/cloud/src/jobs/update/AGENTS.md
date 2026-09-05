# update

Applies a partial change to a job definition.

## Input

- `id`: the job.
- `name, action, triggers, enabled`: any subset.

## Output

The job after the change.

## Rules

- Authorization: the principal needs `jobs:update` on the job, checked through
  [permissions/authorize](../../permissions/authorize/AGENTS.md).
- Running runs keep the definition they started with.
- Side effect: one [activity](../../activity/record/AGENTS.md) entry with the
  actor, the job and the changed fields, and the outcome.
- Runs in-request. It returns the job, not an
  [operation](../../ops/AGENTS.md).
- The acting principal comes from the request context, never from the input.

## Errors

`job not found`, `not authorized`, `name taken`, `invalid trigger`, `invalid action`.
