# /apps/:id/versions

Route marked by `index.ts`. Params: `id`. Each operation validates its input,
resolves the acting principal from the bearer token, and calls one use case in
[lib/apps/versions](../../../../lib/apps/versions/AGENTS.md).

## Operations

### GET

- `GET /apps/:id/versions` calls `list.ts` in
  [lib/apps/versions](../../../../lib/apps/versions/AGENTS.md).
- Path to arguments: `:id` is passed as `appId`.
- Input: `appId` the app.; `cursor, limit` paging.
- Success: `200`. A page of versions.
- Authorization: the principal needs `versions:read` on the app, checked
  through [permissions/authorize](../../../../lib/permissions/AGENTS.md).
- Runs in-request. It returns a page, not an
  [operation](../../../../lib/operations/AGENTS.md).
- The acting principal comes from the request context, never from the input.
- Errors: `404` app not found, `403` not authorized.

### POST

- `POST /apps/:id/versions` calls `create.ts` in
  [lib/apps/versions](../../../../lib/apps/versions/AGENTS.md).
- Path to arguments: `:id` is passed as `appId`.
- Input: `appId` the app.; `source` `kind` and `ref`, or an upload handle.
- Success: `201`. The version with its number and the captured definition.
- Authorization: the principal needs `versions:create` on the app, checked
  through [permissions/authorize](../../../../lib/permissions/AGENTS.md).
- Runs in-request. It returns the version, not an
  [operation](../../../../lib/operations/AGENTS.md).
- The acting principal comes from the request context, never from the input.
- Errors: `404` app not found, `403` not authorized, `422` invalid source,
  `503` source unreachable.

## Pending

- Name and signature of the handler exports; `index.ts` is a marker until
  then.
- Discovery, loading, and validation of routes.
- How the organization context travels (query, header, or path prefix); until
  agreed it is an explicit field.
- Publication or generation of schemas and SDK.
