# start

Starts one run of a job.

## Input

- `jobId`: the job.
- `input`: optional: parameters the action accepts.

## Output

The run with status `queued` or `running`.

## Rules

- Authorization: the principal needs `runs:start` on the job, checked through
  [permissions/authorize](../../../permissions/authorize/AGENTS.md).
- When the principal is an agent acting under a delegation, the check applies
  to the human's permissions, never to a wider set.
- A disabled job still accepts a manual start; only its triggers are off.
- Side effect: one [activity](../../../activity/record/AGENTS.md) entry with
  the actor, the job and the run, and the outcome.
- Returns the run itself, which carries its own status; no operation is
  created.
- The acting principal comes from the request context, never from the input.

## Errors

- `job not found`
- `not authorized`
- `job removed`
