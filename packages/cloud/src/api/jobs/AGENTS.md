# /jobs

Route marked by `index.ts`. Params: none. Each operation validates its input,
resolves the acting principal from the bearer token, and calls one use case in
[lib/jobs](../../lib/jobs/AGENTS.md).

## Operations

### GET

- `GET /jobs` calls `list.ts` in [lib/jobs](../../lib/jobs/AGENTS.md).
- Input: `organizationId` required.; `appId, enabled` optional filters.;
  `cursor, limit` paging.
- Success: `200`. A page of jobs.
- Authorization: the principal needs `jobs:read` on the organization, checked
  through [permissions/authorize](../../lib/permissions/AGENTS.md).
- Runs in-request. It returns a page, not an
  [operation](../../lib/operations/AGENTS.md).
- The acting principal comes from the request context, never from the input.
- Errors: `404` organization not found, `403` not authorized.

### POST

- `POST /jobs` calls `create.ts` in [lib/jobs](../../lib/jobs/AGENTS.md).
- Input: `organizationId` the owner.; `appId` optional.; `name` unique.;
  `target` required: an app path or an HTTPS URL.; `triggers` at least one.;
  `delivery` optional; the cloud's defaults apply.; `enabled` optional; true
  by default.
- Success: `201`. The job.
- Authorization: the principal needs `jobs:create` on the organization, or the
  app when given, checked through
  [permissions/authorize](../../lib/permissions/AGENTS.md).
- When the principal is an agent acting under a delegation, the check applies
  to the human's permissions, never to a wider set.
- Runs in-request. It returns the job, not an
  [operation](../../lib/operations/AGENTS.md).
- The acting principal comes from the request context, never from the input.
- Errors: `404` organization not found, `404` app not found, `403` not
  authorized, `409` name taken, `422` invalid trigger, `422` invalid target.

## Pending

- Name and signature of the handler exports; `index.ts` is a marker until
  then.
- Discovery, loading, and validation of routes.
- How the organization context travels (query, header, or path prefix); until
  agreed it is an explicit field.
- Publication or generation of schemas and SDK.
