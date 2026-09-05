# /apps/:id/environments

Route marked by `index.ts`. Params: `id`. Each operation validates its input,
resolves the acting principal from the bearer token, and calls one use case in
[lib/apps/environments](../../../../lib/apps/environments/AGENTS.md).

## Operations

### GET

- `GET /apps/:id/environments` calls `list.ts` in
  [lib/apps/environments](../../../../lib/apps/environments/AGENTS.md).
- Path to arguments: `:id` is passed as `appId`.
- Input: `appId` the app.; `lifetime` optional filter.; `cursor, limit`
  paging.
- Success: `200`. A page of environments.
- Authorization: the principal needs `environments:read` on the app, checked
  through [permissions/authorize](../../../../lib/permissions/AGENTS.md).
- Runs in-request. It returns a page, not an
  [operation](../../../../lib/operations/AGENTS.md).
- The acting principal comes from the request context, never from the input.
- Errors: `404` app not found, `403` not authorized.

### POST

- `POST /apps/:id/environments` calls `create.ts` in
  [lib/apps/environments](../../../../lib/apps/environments/AGENTS.md).
- Path to arguments: `:id` is passed as `appId`.
- Input: `appId` the app.; `name` unique within the app.; `lifetime`
  `persistent`, or `temporary` with optional `expiresAt`.; `config` optional:
  values and secret references.; `resources` optional: connection and store
  ids.; `access` optional: deploy and promote bindings; defaults to the app's
  roles.; `origin` optional.
- Success: `201`. The environment, with `promotedDeploymentId` empty and its
  stable domain assigned.
- Authorization: the principal needs `environments:create` on the app, checked
  through [permissions/authorize](../../../../lib/permissions/AGENTS.md).
- Runs in-request. It returns the environment, not an
  [operation](../../../../lib/operations/AGENTS.md).
- The acting principal comes from the request context, never from the input.
- Errors: `404` app not found, `403` not authorized, `409` name taken, `422`
  invalid config, `404` connection not found, `404` store not found.

## Pending

- Name and signature of the handler exports; `index.ts` is a marker until
  then.
- Discovery, loading, and validation of routes.
- How the organization context travels (query, header, or path prefix); until
  agreed it is an explicit field.
- Publication or generation of schemas and SDK.
