# /jobs/:id/runs

Route marked by `index.ts`. Params: `id`. Each operation validates its input,
resolves the acting principal from the bearer token, and calls one use case in
[lib/jobs/runs](../../../../lib/jobs/runs/AGENTS.md).

## Operations

### GET

- `GET /jobs/:id/runs` calls `list.ts` in
  [lib/jobs/runs](../../../../lib/jobs/runs/AGENTS.md).
- Path to arguments: `:id` is passed as `jobId`.
- Input: `jobId` the job.; `status, since, until` optional filters.; `cursor,
  limit` paging.
- Success: `200`. A page of runs.
- Authorization: the principal needs `runs:read` on the job, checked through
  [permissions/authorize](../../../../lib/permissions/AGENTS.md).
- Runs in-request. It returns a page, not an
  [operation](../../../../lib/operations/AGENTS.md).
- The acting principal comes from the request context, never from the input.
- Errors: `404` job not found, `403` not authorized.

### POST

- `POST /jobs/:id/runs` calls `start.ts` in
  [lib/jobs/runs](../../../../lib/jobs/runs/AGENTS.md).
- Path to arguments: `:id` is passed as `jobId`.
- Input: `jobId` the job.; `payload` optional: data the target receives in the
  body.
- Success: `201`. The run with status `queued` or `delivering`.
- Authorization: the principal needs `runs:start` on the job, checked through
  [permissions/authorize](../../../../lib/permissions/AGENTS.md).
- When the principal is an agent acting under a delegation, the check applies
  to the human's permissions, never to a wider set.
- Returns the run itself, which carries its own status; no operation is
  created.
- The acting principal comes from the request context, never from the input.
- Errors: `404` job not found, `403` not authorized, `409` job removed.

## Pending

- Name and signature of the handler exports; `index.ts` is a marker until
  then.
- Discovery, loading, and validation of routes.
- How the organization context travels (query, header, or path prefix); until
  agreed it is an explicit field.
- Publication or generation of schemas and SDK.
