# /apps/:id/rollback/:deploymentId

Proposal, not a route: no `index.ts` until agreed. Params: `id`,
`deploymentId`. Each operation validates its input, resolves the acting
principal from the bearer token, and calls one use case in
[lib/apps/deployments](../../../../../lib/apps/deployments/AGENTS.md).

## Operations

### POST

- `POST /apps/:id/rollback/:deploymentId` calls `rollback.ts` in
  [lib/apps/deployments](../../../../../lib/apps/deployments/AGENTS.md).
- Path to arguments: `:id` is passed as `appId`; `:deploymentId` is passed as
  `to`.
- Input: `appId` the app.; `to` optional: a deployment id or version number;
  defaults to the previously live deployment.
- Success: `202`. An operation reference; its result is the new deployment and
  a note that data migrations are not reversed.
- Authorization: the principal needs `deployments:rollback` on the app,
  checked through
  [permissions/authorize](../../../../../lib/permissions/AGENTS.md).
- Long-running. It returns an
  [operation](../../../../../lib/operations/AGENTS.md) reference at once; the
  new deployment arrives through it.
- The acting principal comes from the request context, never from the input.
- Errors: `404` app not found, `409` nothing to roll back to, `403` not
  authorized, `409` deployment in progress.

## Pending

- The proposal itself: Mirrors Vercel, `POST
  /v1/projects/{projectId}/rollback/{deploymentId}`: point production at a
  previous deployment by id. A rollback in Syner creates a new deployment of
  the target's version, so POST fits; the target travels in the path, as
  Vercel does, and the CLI resolves the default (the previously live
  deployment) before calling.
- Name and signature of the handler exports; `index.ts` is a marker until
  then.
- Discovery, loading, and validation of routes.
- How the organization context travels (query, header, or path prefix); until
  agreed it is an explicit field.
- Publication or generation of schemas and SDK.
