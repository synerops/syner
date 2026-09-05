# /storage/stores/:id/files/:path

Route marked by `index.ts`. Params: `id`, `path`. Each operation validates its
input, resolves the acting principal from the bearer token, and calls one use
case in [lib/storage/files](../../../../../../lib/storage/files/AGENTS.md).

## Operations

### PUT

- `PUT /storage/stores/:id/files/:path` calls `put.ts` in
  [lib/storage/files](../../../../../../lib/storage/files/AGENTS.md).
- Path to arguments: `:id` is passed as `storeId`; `:path` is passed as
  `path`.
- Input: `storeId` the store.; `path` required.; `body` a stream or bytes.;
  `contentType` required.
- Success: `200/201`. The file's metadata with its new etag.
- Authorization: the principal needs `files:write` on the store, checked
  through
  [permissions/authorize](../../../../../../lib/permissions/AGENTS.md).
- Runs in-request. It returns the metadata; the upload itself streams within
  the request, not an [operation](../../../../../../lib/operations/AGENTS.md).
- The acting principal comes from the request context, never from the input.
- Errors: `404` store not found, `403` not authorized, `413` file too large.

### GET

- `GET /storage/stores/:id/files/:path` calls `get.ts` in
  [lib/storage/files](../../../../../../lib/storage/files/AGENTS.md).
- Path to arguments: `:id` is passed as `storeId`; `:path` is passed as
  `path`.
- Input: `storeId` the store.; `path` required.
- Success: `200`. The file's metadata and a read handle or short-lived URL.
- Authorization: the principal needs `files:read` on the store, checked
  through
  [permissions/authorize](../../../../../../lib/permissions/AGENTS.md).
- Runs in-request. It returns the metadata and handle, not an
  [operation](../../../../../../lib/operations/AGENTS.md).
- The acting principal comes from the request context, never from the input.
- Errors: `404` store not found, `404` file not found, `403` not authorized.

### DELETE

- `DELETE /storage/stores/:id/files/:path` calls `remove.ts` in
  [lib/storage/files](../../../../../../lib/storage/files/AGENTS.md).
- Path to arguments: `:id` is passed as `storeId`; `:path` is passed as
  `path`.
- Input: `storeId` the store.; `path` required.
- Success: `204`. Nothing but confirmation.
- Authorization: the principal needs `files:write` on the store, checked
  through
  [permissions/authorize](../../../../../../lib/permissions/AGENTS.md).
- Runs in-request. It returns confirmation, not an
  [operation](../../../../../../lib/operations/AGENTS.md).
- The acting principal comes from the request context, never from the input.
- Errors: `404` store not found, `404` file not found, `403` not authorized.

## Pending

- Paths contain `/`. How a multi-segment path is captured by `[path]` is
  pending.
- The PUT body is the file's bytes, streamed; the GET response carries
  metadata and a read handle. Streaming mechanics are pending.
- Name and signature of the handler exports; `index.ts` is a marker until
  then.
- Discovery, loading, and validation of routes.
- How the organization context travels (query, header, or path prefix); until
  agreed it is an explicit field.
- Publication or generation of schemas and SDK.
