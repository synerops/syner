# /apps/:id/deployments/:deploymentId

Route marked by `index.ts`. Params: `id`, `deploymentId`. Each operation
validates its input, resolves the acting principal from the bearer token, and
calls one use case in
[lib/apps/deployments](../../../../../lib/apps/deployments/AGENTS.md).

## Operations

### GET

- `GET /apps/:id/deployments/:deploymentId` calls `get.ts` in
  [lib/apps/deployments](../../../../../lib/apps/deployments/AGENTS.md).
- Path to arguments: `:id` is passed as `appId`; `:deploymentId` is passed as
  `id`.
- Input: `appId` the app.; `id` the deployment.
- Success: `200`. The deployment.
- Authorization: the principal needs `deployments:read` on the app, checked
  through [permissions/authorize](../../../../../lib/permissions/AGENTS.md).
- Runs in-request. It returns the deployment, not an
  [operation](../../../../../lib/operations/AGENTS.md).
- The acting principal comes from the request context, never from the input.
- Errors: `404` app not found, `404` deployment not found, `403` not
  authorized.

## Pending

- Name and signature of the handler exports; `index.ts` is a marker until
  then.
- Discovery, loading, and validation of routes.
- How the organization context travels (query, header, or path prefix); until
  agreed it is an explicit field.
- Publication or generation of schemas and SDK.
