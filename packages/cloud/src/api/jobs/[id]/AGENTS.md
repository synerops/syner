# /jobs/:id

Route marked by `index.ts`. Params: `id`. Each operation validates its input,
resolves the acting principal from the bearer token, and calls one use case in
[lib/jobs](../../../lib/jobs/AGENTS.md).

## Operations

### GET

- `GET /jobs/:id` calls `get.ts` in [lib/jobs](../../../lib/jobs/AGENTS.md).
- Path to arguments: `:id` is passed as `id`.
- Input: `id` the job, or; `organizationId + name` the pair.
- Success: `200`. The job with its latest run summary.
- Authorization: the principal needs `jobs:read` on the job, checked through
  [permissions/authorize](../../../lib/permissions/AGENTS.md).
- Runs in-request. It returns the job, not an
  [operation](../../../lib/operations/AGENTS.md).
- The acting principal comes from the request context, never from the input.
- Errors: `404` job not found, `403` not authorized.

### PATCH

- `PATCH /jobs/:id` calls `update.ts` in
  [lib/jobs](../../../lib/jobs/AGENTS.md).
- Path to arguments: `:id` is passed as `id`.
- Input: `id` the job.; `name, target, triggers, delivery, enabled` any
  subset.
- Success: `200`. The job after the change.
- Authorization: the principal needs `jobs:update` on the job, checked through
  [permissions/authorize](../../../lib/permissions/AGENTS.md).
- Runs in-request. It returns the job, not an
  [operation](../../../lib/operations/AGENTS.md).
- The acting principal comes from the request context, never from the input.
- Errors: `404` job not found, `403` not authorized, `409` name taken, `422`
  invalid trigger, `422` invalid target.

### DELETE

- `DELETE /jobs/:id` calls `remove.ts` in
  [lib/jobs](../../../lib/jobs/AGENTS.md).
- Path to arguments: `:id` is passed as `id`.
- Input: `id` the job.
- Success: `204`. Nothing but confirmation.
- Authorization: the principal needs `jobs:remove` on the job, checked through
  [permissions/authorize](../../../lib/permissions/AGENTS.md).
- Runs in-request. It returns confirmation, not an
  [operation](../../../lib/operations/AGENTS.md).
- The acting principal comes from the request context, never from the input.
- Errors: `404` job not found, `403` not authorized.

## Pending

- Name and signature of the handler exports; `index.ts` is a marker until
  then.
- Discovery, loading, and validation of routes.
- How the organization context travels (query, header, or path prefix); until
  agreed it is an explicit field.
- Publication or generation of schemas and SDK.
