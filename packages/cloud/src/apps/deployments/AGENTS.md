# deployments

Owns the deployments of an app: which version serves traffic, where, and since
when.

## Schema (index)

- `id`: stable.
- `appId`: the app.
- `versionId`: never changes after creation.
- `status`: `pending`, `live`, `failed`, `retired`.
- `url`: set when live.
- `target`: `compute` or `provider`, plus the target's own reference.
- `operationId`: the operation that created it.
- `createdBy, createdAt, finishedAt`: principal and timestamps.

## Rules

- At most one deployment is `live` per app.
- A deployment never changes its version; a new version means a new
  deployment.
- Transitions: `pending` becomes `live` or `failed`; `live` becomes `retired`.
  Nothing else.
- Rollback creates a new deployment of an earlier version and marks in its
  result that data migrations are not reversed.

## Verbs

- [create](create/AGENTS.md): puts a version into service
- [get](get/AGENTS.md): returns one deployment with its status and URL
- [list](list/AGENTS.md): returns the app's deployments, newest first
- [rollback](rollback/AGENTS.md): deploys a previous version again
