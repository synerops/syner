# /apps/:id

Route marked by `index.ts`. Params: `id`. Each operation validates its input,
resolves the acting principal from the bearer token, and calls one use case in
[lib/apps](../../../lib/apps/AGENTS.md).

## Operations

### GET

- `GET /apps/:id` calls `get.ts` in [lib/apps](../../../lib/apps/AGENTS.md).
- Path to arguments: `:id` is passed as `id`.
- Input: `id` the app id, or; `organizationId + name` the pair that identifies
  it.
- Success: `200`. The app, with `currentDeployment` (`id`, `status`, `url`)
  when it has one.
- Authorization: the principal needs `apps:read` on the app, checked through
  [permissions/authorize](../../../lib/permissions/AGENTS.md).
- Runs in-request. It returns the app, not an
  [operation](../../../lib/operations/AGENTS.md).
- The acting principal comes from the request context, never from the input.
- Errors: `404` app not found, `403` not authorized.

### PATCH

- `PATCH /apps/:id` calls `update.ts` in
  [lib/apps](../../../lib/apps/AGENTS.md).
- Path to arguments: `:id` is passed as `id`.
- Input: `id` the app.; `name, backend, frontend, purpose` any subset; only
  the given fields change. `purpose` is replaced whole.
- Success: `200`. The app as stored after the change.
- Authorization: the principal needs `apps:update` on the app, checked through
  [permissions/authorize](../../../lib/permissions/AGENTS.md).
- Runs in-request. It returns the app, not an
  [operation](../../../lib/operations/AGENTS.md).
- The acting principal comes from the request context, never from the input.
- Errors: `404` app not found, `403` not authorized, `409` name taken, `422`
  invalid backend.

### DELETE

- `DELETE /apps/:id` calls `remove.ts` in
  [lib/apps](../../../lib/apps/AGENTS.md).
- Path to arguments: `:id` is passed as `id`.
- Input: `id` the app.
- Success: `202`. An operation reference; its result is the app marked
  removed.
- Authorization: the principal needs `apps:remove` on the app, checked through
  [permissions/authorize](../../../lib/permissions/AGENTS.md).
- Long-running. It returns an [operation](../../../lib/operations/AGENTS.md)
  reference at once; the removed app arrives through it.
- The acting principal comes from the request context, never from the input.
- Errors: `404` app not found, `403` not authorized, `409` removal in
  progress.

## Pending

- Name and signature of the handler exports; `index.ts` is a marker until
  then.
- Discovery, loading, and validation of routes.
- How the organization context travels (query, header, or path prefix); until
  agreed it is an explicit field.
- Publication or generation of schemas and SDK.
