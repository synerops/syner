# get

Reads one job.

## Input

- `id`: the job, or
- `organizationId + name`: the pair.

## Output

The job with its latest run summary.

## Rules

- Authorization: the principal needs `jobs:read` on the job, checked through
  [permissions/authorize](../../permissions/authorize/AGENTS.md).
- Runs in-request. It returns the job, not an
  [operation](../../ops/AGENTS.md).
- The acting principal comes from the request context, never from the input.

## Errors

- `job not found`
- `not authorized`
