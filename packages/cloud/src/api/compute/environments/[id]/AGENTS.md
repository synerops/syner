# /compute/environments/:id

Route marked by `index.ts`. Params: `id`. Each operation validates its input,
resolves the acting principal from the bearer token, and calls one use case in
[lib/compute/environments](../../../../lib/compute/environments/AGENTS.md).

## Operations

### GET

- `GET /compute/environments/:id` calls `get.ts` in
  [lib/compute/environments](../../../../lib/compute/environments/AGENTS.md).
- Path to arguments: `:id` is passed as `id`.
- Input: `id` the environment.
- Success: `200`. The environment.
- Authorization: the principal needs `environments:read` on the environment,
  checked through
  [permissions/authorize](../../../../lib/permissions/AGENTS.md).
- Runs in-request. It returns the environment, not an
  [operation](../../../../lib/operations/AGENTS.md).
- The acting principal comes from the request context, never from the input.
- Errors: `404` environment not found, `403` not authorized.

### DELETE

- `DELETE /compute/environments/:id` calls `remove.ts` in
  [lib/compute/environments](../../../../lib/compute/environments/AGENTS.md).
- Path to arguments: `:id` is passed as `id`.
- Input: `id` the environment.
- Success: `202`. An operation reference; its result is the stopped
  environment.
- Authorization: the principal needs `environments:remove` on the environment,
  checked through
  [permissions/authorize](../../../../lib/permissions/AGENTS.md).
- Long-running. It returns an
  [operation](../../../../lib/operations/AGENTS.md) reference at once; the
  stopped environment arrives through it.
- The acting principal comes from the request context, never from the input.
- Errors: `404` environment not found, `403` not authorized, `409` already
  stopped.

## Pending

- Name and signature of the handler exports; `index.ts` is a marker until
  then.
- Discovery, loading, and validation of routes.
- How the organization context travels (query, header, or path prefix); until
  agreed it is an explicit field.
- Publication or generation of schemas and SDK.
