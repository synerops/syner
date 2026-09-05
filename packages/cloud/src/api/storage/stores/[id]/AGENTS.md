# /storage/stores/:id

Route marked by `index.ts`. Params: `id`. Each operation validates its input,
resolves the acting principal from the bearer token, and calls one use case in
[lib/storage/stores](../../../../lib/storage/stores/AGENTS.md).

## Operations

### GET

- `GET /storage/stores/:id` calls `get.ts` in
  [lib/storage/stores](../../../../lib/storage/stores/AGENTS.md).
- Path to arguments: `:id` is passed as `id`.
- Input: `id` the store, or; `organizationId + name` the pair.
- Success: `200`. The store.
- Authorization: the principal needs `stores:read` on the store, checked
  through [permissions/authorize](../../../../lib/permissions/AGENTS.md).
- Runs in-request. It returns the store, not an
  [operation](../../../../lib/operations/AGENTS.md).
- The acting principal comes from the request context, never from the input.
- Errors: `404` store not found, `403` not authorized.

### DELETE

- `DELETE /storage/stores/:id` calls `remove.ts` in
  [lib/storage/stores](../../../../lib/storage/stores/AGENTS.md).
- Path to arguments: `:id` is passed as `id`.
- Input: `id` the store.
- Success: `202`. An operation reference; its result is the removed store.
- Authorization: the principal needs `stores:remove` on the store, checked
  through [permissions/authorize](../../../../lib/permissions/AGENTS.md).
- Long-running. It returns an
  [operation](../../../../lib/operations/AGENTS.md) reference at once; the
  removed store arrives through it.
- The acting principal comes from the request context, never from the input.
- Errors: `404` store not found, `403` not authorized, `409` removal in
  progress.

## Pending

- Name and signature of the handler exports; `index.ts` is a marker until
  then.
- Discovery, loading, and validation of routes.
- How the organization context travels (query, header, or path prefix); until
  agreed it is an explicit field.
- Publication or generation of schemas and SDK.
