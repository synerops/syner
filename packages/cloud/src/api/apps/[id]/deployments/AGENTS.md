# /apps/:id/deployments

Route marked by `index.ts`. Params: `id`. Each operation validates its input,
resolves the acting principal from the bearer token, and calls one use case in
[lib/apps/deployments](../../../../lib/apps/deployments/AGENTS.md).

## Operations

### GET

- `GET /apps/:id/deployments` calls `list.ts` in
  [lib/apps/deployments](../../../../lib/apps/deployments/AGENTS.md).
- Path to arguments: `:id` is passed as `appId`.
- Input: `appId` the app.; `status` optional filter.; `cursor, limit` paging.
- Success: `200`. A page of deployments.
- Authorization: the principal needs `deployments:read` on the app, checked
  through [permissions/authorize](../../../../lib/permissions/AGENTS.md).
- Runs in-request. It returns a page, not an
  [operation](../../../../lib/operations/AGENTS.md).
- The acting principal comes from the request context, never from the input.
- Errors: `404` app not found, `403` not authorized.

### POST

- `POST /apps/:id/deployments` calls `create.ts` in
  [lib/apps/deployments](../../../../lib/apps/deployments/AGENTS.md).
- Path to arguments: `:id` is passed as `appId`.
- Input: `appId` the app.; `versionId or number` the version.; `target`
  optional; the cloud's default target when omitted.
- Success: `202`. An operation reference; its result is the deployment, live
  or failed.
- Authorization: the principal needs `deployments:create` on the app, checked
  through [permissions/authorize](../../../../lib/permissions/AGENTS.md).
- Long-running. It returns an
  [operation](../../../../lib/operations/AGENTS.md) reference at once; the
  deployment arrives through it.
- The acting principal comes from the request context, never from the input.
- Errors: `404` app not found, `404` version not found, `403` not authorized,
  `409` deployment in progress, `503` target unavailable.

## Pending

- Name and signature of the handler exports; `index.ts` is a marker until
  then.
- Discovery, loading, and validation of routes.
- How the organization context travels (query, header, or path prefix); until
  agreed it is an explicit field.
- Publication or generation of schemas and SDK.
