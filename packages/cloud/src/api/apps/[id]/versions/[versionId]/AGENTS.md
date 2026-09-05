# /apps/:id/versions/:versionId

Route marked by `index.ts`. Params: `id`, `versionId`. Each operation
validates its input, resolves the acting principal from the bearer token, and
calls one use case in
[lib/apps/versions](../../../../../lib/apps/versions/AGENTS.md).

## Operations

### GET

- `GET /apps/:id/versions/:versionId` calls `get.ts` in
  [lib/apps/versions](../../../../../lib/apps/versions/AGENTS.md).
- Path to arguments: `:id` is passed as `appId`; `:versionId` is passed as
  `id`.
- Input: `appId` the app.; `number` the version number, or `id`.
- Success: `200`. The version.
- Authorization: the principal needs `versions:read` on the app, checked
  through [permissions/authorize](../../../../../lib/permissions/AGENTS.md).
- Runs in-request. It returns the version, not an
  [operation](../../../../../lib/operations/AGENTS.md).
- The acting principal comes from the request context, never from the input.
- Errors: `404` app not found, `404` version not found, `403` not authorized.

## Pending

- Name and signature of the handler exports; `index.ts` is a marker until
  then.
- Discovery, loading, and validation of routes.
- How the organization context travels (query, header, or path prefix); until
  agreed it is an explicit field.
- Publication or generation of schemas and SDK.
