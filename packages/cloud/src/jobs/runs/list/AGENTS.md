# list

Lists the runs of a job, paged.

## Input

- `jobId`: the job.
- `status, since, until`: optional filters.
- `cursor, limit`: paging.

## Output

A page of runs.

## Rules

- Authorization: the principal needs `runs:read` on the job, checked through
  [permissions/authorize](../../../permissions/authorize/AGENTS.md).
- Runs in-request. It returns a page, not an
  [operation](../../../ops/AGENTS.md).
- The acting principal comes from the request context, never from the input.

## Errors

`job not found`, `not authorized`.
