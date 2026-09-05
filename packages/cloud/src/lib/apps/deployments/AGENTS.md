# deployments

Owns the deployments of an app: which version serves traffic, where, and since
when.

## Model (`deployment.ts`)

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
- `live` is an administrative state: the deployment was put into service and
  has not been retired. It is not evidence that the app answers right now;
  runtime health has no source in this spec.
- Pending: application environments (production, staging, previews) are not
  modeled. The one-live-deployment rule holds until that decision is taken;
  references under review are Vercel environments and Laravel Cloud
  environments.

## Use cases

### `create.ts`

Creates a deployment of a version and drives it to live.

- When the deployment becomes live, it becomes the app's current deployment
  and the previous live one becomes retired.
- A failed deployment leaves the previous live deployment untouched.
- Side effect: one [activity](../../activity/AGENTS.md) entry with the actor,
  the app, the version, and the deployment, and the outcome.

### `get.ts`

Reads one deployment of an app.

### `list.ts`

Lists the deployments of an app, paged.

### `rollback.ts`

Creates a deployment of a previous version and drives it to live.

- Rollback never mutates an existing deployment; it creates one.
- Without `to`, the target is the deployment that was live before the current
  one; with none, the call fails.
- Side effect: one [activity](../../activity/AGENTS.md) entry with the actor,
  the app, the version rolled back to, and the outcome.

## Exposure

Exposed through `POST /apps/:id/deployments`, `GET
/apps/:id/deployments/:deploymentId`, `GET /apps/:id/deployments`. Contracts:
[/apps/:id/deployments](../../../api/apps/[id]/deployments/AGENTS.md),
[/apps/:id/deployments/:deploymentId](../../../api/apps/[id]/deployments/[deploymentId]/AGENTS.md).
Proposed, not agreed: `POST /apps/:id/rollback/:deploymentId` for `rollback`;
see [the proposal](../../../api/apps/[id]/rollback/[deploymentId]/AGENTS.md).
