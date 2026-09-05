# /compute/environments

Route marked by `index.ts`. Params: none. Each operation validates its input,
resolves the acting principal from the bearer token, and calls one use case in
[lib/compute/environments](../../../lib/compute/environments/AGENTS.md).

## Operations

### GET

- `GET /compute/environments` calls `list.ts` in
  [lib/compute/environments](../../../lib/compute/environments/AGENTS.md).
- Input: `organizationId` required.; `status` optional filter.; `cursor,
  limit` paging.
- Success: `200`. A page of environments.
- Authorization: the principal needs `environments:read` on the organization,
  checked through [permissions/authorize](../../../lib/permissions/AGENTS.md).
- Runs in-request. It returns a page, not an
  [operation](../../../lib/operations/AGENTS.md).
- The acting principal comes from the request context, never from the input.
- Errors: `404` organization not found, `403` not authorized.

### POST

- `POST /compute/environments` calls `create.ts` in
  [lib/compute/environments](../../../lib/compute/environments/AGENTS.md).
- Input: `organizationId` the owner.; `runtime` a named runtime.; `resources`
  optional; defaults apply.; `lifetime` optional; `ephemeral` by default.
- Success: `202`. An operation reference; its result is the environment, ready
  or failed.
- Authorization: the principal needs `environments:create` on the
  organization, checked through
  [permissions/authorize](../../../lib/permissions/AGENTS.md).
- When the principal is an agent acting under a delegation, the check applies
  to the human's permissions, never to a wider set.
- Long-running. It returns an [operation](../../../lib/operations/AGENTS.md)
  reference at once; the environment arrives through it.
- The acting principal comes from the request context, never from the input.
- Errors: `404` organization not found, `403` not authorized, `422` unknown
  runtime, `503` resources unavailable.

## Pending

- Name and signature of the handler exports; `index.ts` is a marker until
  then.
- Discovery, loading, and validation of routes.
- How the organization context travels (query, header, or path prefix); until
  agreed it is an explicit field.
- Publication or generation of schemas and SDK.
