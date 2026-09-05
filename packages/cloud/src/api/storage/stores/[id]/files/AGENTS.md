# /storage/stores/:id/files

Route marked by `index.ts`. Params: `id`. Each operation validates its input,
resolves the acting principal from the bearer token, and calls one use case in
[lib/storage/files](../../../../../lib/storage/files/AGENTS.md).

## Operations

### GET

- `GET /storage/stores/:id/files` calls `list.ts` in
  [lib/storage/files](../../../../../lib/storage/files/AGENTS.md).
- Path to arguments: `:id` is passed as `storeId`.
- Input: `storeId` the store.; `prefix` optional.; `cursor, limit` paging.
- Success: `200`. A page of file metadata.
- Authorization: the principal needs `files:read` on the store, checked
  through [permissions/authorize](../../../../../lib/permissions/AGENTS.md).
- Runs in-request. It returns a page, not an
  [operation](../../../../../lib/operations/AGENTS.md).
- The acting principal comes from the request context, never from the input.
- Errors: `404` store not found, `403` not authorized.

## Pending

- Name and signature of the handler exports; `index.ts` is a marker until
  then.
- Discovery, loading, and validation of routes.
- How the organization context travels (query, header, or path prefix); until
  agreed it is an explicit field.
- Publication or generation of schemas and SDK.
