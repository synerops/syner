# /apps/:id/environments/:environmentId

Route marked by `index.ts`. Params: `id`, `environmentId`. Each operation
validates its input, resolves the acting principal from the bearer token, and
calls one use case in
[lib/apps/environments](../../../../../lib/apps/environments/AGENTS.md).

## Operations

### GET

- `GET /apps/:id/environments/:environmentId` calls `get.ts` in
  [lib/apps/environments](../../../../../lib/apps/environments/AGENTS.md).
- Path to arguments: `:id` is passed as `appId`; `:environmentId` is passed as
  `id`.
- Input: `appId` the app.; `id` the environment.
- Success: `200`. The environment. Secret values are never returned, only
  their references.
- Authorization: the principal needs `environments:read` on the environment,
  checked through
  [permissions/authorize](../../../../../lib/permissions/AGENTS.md).
- Runs in-request. It returns the environment, not an
  [operation](../../../../../lib/operations/AGENTS.md).
- The acting principal comes from the request context, never from the input.
- Errors: `404` app not found, `404` environment not found, `403` not
  authorized.

### PATCH

- `PATCH /apps/:id/environments/:environmentId` calls `update.ts` in
  [lib/apps/environments](../../../../../lib/apps/environments/AGENTS.md).
- Path to arguments: `:id` is passed as `appId`; `:environmentId` is passed as
  `id`.
- Input: `appId` the app.; `id` the environment.; `name, lifetime, config,
  resources, access, origin` any subset; `config.values` and `config.secrets`
  are replaced whole.
- Success: `200`. The environment after the change.
- Authorization: the principal needs `environments:update` on the environment,
  checked through
  [permissions/authorize](../../../../../lib/permissions/AGENTS.md).
- Runs in-request. It returns the environment, not an
  [operation](../../../../../lib/operations/AGENTS.md).
- The acting principal comes from the request context, never from the input.
- Errors: `404` app not found, `404` environment not found, `403` not
  authorized, `409` name taken, `422` invalid config.

### DELETE

- `DELETE /apps/:id/environments/:environmentId` calls `remove.ts` in
  [lib/apps/environments](../../../../../lib/apps/environments/AGENTS.md).
- Path to arguments: `:id` is passed as `appId`; `:environmentId` is passed as
  `id`.
- Input: `appId` the app.; `id` the environment.
- Success: `202`. An operation reference; its result is the removed
  environment.
- Authorization: the principal needs `environments:remove` on the environment,
  checked through
  [permissions/authorize](../../../../../lib/permissions/AGENTS.md).
- Long-running. It returns an
  [operation](../../../../../lib/operations/AGENTS.md) reference at once; the
  removed environment arrives through it.
- The acting principal comes from the request context, never from the input.
- Errors: `404` app not found, `404` environment not found, `403` not
  authorized, `409` removal in progress.

## Pending

- Promotion has its own route so that pointing the domain at a deployment is
  never mistaken for editing the definition.
- Name and signature of the handler exports; `index.ts` is a marker until
  then.
- Discovery, loading, and validation of routes.
- How the organization context travels (query, header, or path prefix); until
  agreed it is an explicit field.
- Publication or generation of schemas and SDK.
