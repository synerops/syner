# /apps/:id/environments/:environmentId/promote/:deploymentId

Route marked by `index.ts`. Params: `id`, `environmentId`, `deploymentId`.
Each operation validates its input, resolves the acting principal from the
bearer token, and calls one use case in
[lib/apps/environments](../../../../../../../lib/apps/environments/AGENTS.md).

## Operations

### POST

- `POST /apps/:id/environments/:environmentId/promote/:deploymentId` calls
  `promote.ts` in
  [lib/apps/environments](../../../../../../../lib/apps/environments/AGENTS.md).
- Path to arguments: `:id` is passed as `appId`; `:environmentId` is passed as
  `id`; `:deploymentId` is passed as `deploymentId`.
- Input: `appId` the app.; `id` the environment.; `deploymentId` a deployment
  of this environment with availability `available`.
- Success: `202`. An operation reference. `202` means the promotion is
  requested, not that traffic has changed; the operation's result is the
  environment with `promotedDeploymentId` set once the domain answers with the
  new deployment.
- Authorization: the principal needs `environments:promote` on the
  environment, checked through
  [permissions/authorize](../../../../../../../lib/permissions/AGENTS.md).
- Long-running. It returns an
  [operation](../../../../../../../lib/operations/AGENTS.md) reference at
  once; the environment with the new promotion arrives through it.
- The acting principal comes from the request context, never from the input.
- Errors: `404` app not found, `404` environment not found, `404` deployment
  not found, `422` deployment not available, `403` not authorized, `409`
  promotion in progress.

## Pending

- `POST` because promotion starts work: the domain switch is long-running and
  answers `202` with an operation. Rollback is this call with an earlier
  deployment; Vercel's `POST /v1/projects/{projectId}/rollback/{deploymentId}`
  is the equivalent intent.
- Name and signature of the handler exports; `index.ts` is a marker until
  then.
- Discovery, loading, and validation of routes.
- How the organization context travels (query, header, or path prefix); until
  agreed it is an explicit field.
- Publication or generation of schemas and SDK.
