# /storage/stores/:id/documents/:key

Route marked by `index.ts`. Params: `id`, `key`. Each operation validates its
input, resolves the acting principal from the bearer token, and calls one use
case in
[lib/storage/documents](../../../../../../lib/storage/documents/AGENTS.md).

## Operations

### PUT

- `PUT /storage/stores/:id/documents/:key` calls `put.ts` in
  [lib/storage/documents](../../../../../../lib/storage/documents/AGENTS.md).
- Path to arguments: `:id` is passed as `storeId`; `:key` is passed as `key`.
- Input: `storeId` the store.; `key` required.; `body` JSON.; `ifVersion`
  optional condition.
- Success: `200/201`. The document's key and new version.
- Authorization: the principal needs `documents:write` on the store, checked
  through
  [permissions/authorize](../../../../../../lib/permissions/AGENTS.md).
- Runs in-request. It returns the key and version, not an
  [operation](../../../../../../lib/operations/AGENTS.md).
- The acting principal comes from the request context, never from the input.
- Errors: `404` store not found, `403` not authorized, `409` version mismatch,
  `413` body too large.

### GET

- `GET /storage/stores/:id/documents/:key` calls `get.ts` in
  [lib/storage/documents](../../../../../../lib/storage/documents/AGENTS.md).
- Path to arguments: `:id` is passed as `storeId`; `:key` is passed as `key`.
- Input: `storeId` the store.; `key` required.
- Success: `200`. The document.
- Authorization: the principal needs `documents:read` on the store, checked
  through
  [permissions/authorize](../../../../../../lib/permissions/AGENTS.md).
- Runs in-request. It returns the document, not an
  [operation](../../../../../../lib/operations/AGENTS.md).
- The acting principal comes from the request context, never from the input.
- Errors: `404` store not found, `404` document not found, `403` not
  authorized.

### DELETE

- `DELETE /storage/stores/:id/documents/:key` calls `remove.ts` in
  [lib/storage/documents](../../../../../../lib/storage/documents/AGENTS.md).
- Path to arguments: `:id` is passed as `storeId`; `:key` is passed as `key`.
- Input: `storeId` the store.; `key` required.; `ifVersion` optional
  condition.
- Success: `204`. Nothing but confirmation.
- Authorization: the principal needs `documents:write` on the store, checked
  through
  [permissions/authorize](../../../../../../lib/permissions/AGENTS.md).
- Runs in-request. It returns confirmation, not an
  [operation](../../../../../../lib/operations/AGENTS.md).
- The acting principal comes from the request context, never from the input.
- Errors: `404` store not found, `404` document not found, `403` not
  authorized, `409` version mismatch.

## Pending

- Keys may contain `/`. How a multi-segment key is captured by `[key]` is
  pending.
- Name and signature of the handler exports; `index.ts` is a marker until
  then.
- Discovery, loading, and validation of routes.
- How the organization context travels (query, header, or path prefix); until
  agreed it is an explicit field.
- Publication or generation of schemas and SDK.
