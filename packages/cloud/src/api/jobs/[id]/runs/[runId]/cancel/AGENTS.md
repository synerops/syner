# /jobs/:id/runs/:runId/cancel

Route marked by `index.ts`. Params: `id`, `runId`. Each operation validates
its input, resolves the acting principal from the bearer token, and calls one
use case in [lib/jobs/runs](../../../../../../lib/jobs/runs/AGENTS.md).

## Operations

### PATCH

- `PATCH /jobs/:id/runs/:runId/cancel` calls `cancel.ts` in
  [lib/jobs/runs](../../../../../../lib/jobs/runs/AGENTS.md).
- Path to arguments: `:id` is passed as `jobId`; `:runId` is passed as `id`.
- Input: `id` the run.
- Success: `200`. The run with status `cancelled`, or its current final status
  if it had already ended.
- Authorization: the principal needs `runs:cancel` on the job, checked through
  [permissions/authorize](../../../../../../lib/permissions/AGENTS.md).
- Runs in-request. It returns the run, not an
  [operation](../../../../../../lib/operations/AGENTS.md).
- The acting principal comes from the request context, never from the input.
- Errors: `404` run not found, `403` not authorized.

## Pending

- Name and signature of the handler exports; `index.ts` is a marker until
  then.
- Discovery, loading, and validation of routes.
- How the organization context travels (query, header, or path prefix); until
  agreed it is an explicit field.
- Publication or generation of schemas and SDK.
