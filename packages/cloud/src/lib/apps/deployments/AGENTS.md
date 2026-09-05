# deployments

Owns the deployments of an app: which version runs in which environment, how
the deploy went, whether it is available, and where it answers.

## Model (`deployment.ts`)

- `id`: stable.
- `appId`: the app.
- `environmentId`: the environment; never changes.
- `versionId`: never changes after creation.
- `process`: `pending`, `ready`, `failed`, `cancelled`.
- `availability`: `available` once ready, `retired` when withdrawn; `failed`
  deployments are never available.
- `url`: the deployment's own address, set when ready.
- `target`: `compute` or `provider`, plus the target's own reference.
- `configCapturedAt`: when the environment's configuration was captured into
  this deployment. What is captured is pending.
- `operationId`: the operation that created it.
- `createdBy, createdAt, finishedAt`: principal and timestamps.

## Rules

- A deployment belongs to exactly one environment and one version; neither
  changes.
- Process transitions: `pending` becomes `ready`, `failed`, or `cancelled`.
  Nothing else.
- Availability: `available` when ready; `retired` by removal of the
  environment or the app, or by a later decision. Several deployments of one
  environment can be `available` at once.
- Promotion is not a field here. It is the environment's
  `promotedDeploymentId`; a deployment reports it as derived.
- Creating a deployment never changes the environment's promotion.
- Health is not modeled: process and availability say nothing about whether
  the app answers right now. Runtime health has no source in this spec.
- Promotion between environments is a new deployment of the same version in
  the target environment. Reuse of the build artifact is not promised: a
  configuration difference may require building again.
- Pending: whether a deployment can be cancelled while pending (the cancel
  pattern exists for executions and runs); whether a single deployment can be
  retired by hand.

## Use cases

### `create.ts`

Creates a deployment of a version inside an environment and drives it to
ready.

- The environment's configuration is captured into the deployment at creation;
  what exactly is captured is pending.
- When ready, the deployment becomes `available`. The environment's promotion
  does not change.
- A failed deployment leaves the environment's promotion untouched.
- Side effect: one [activity](../../activity/AGENTS.md) entry with the actor,
  the app, the environment, the version, and the deployment, and the outcome.

### `get.ts`

Reads one deployment of an app.

### `list.ts`

Lists the deployments of an app, paged.

## Exposure

Exposed through `POST /apps/:id/deployments`, `GET
/apps/:id/deployments/:deploymentId`, `GET /apps/:id/deployments`. Contracts:
[/apps/:id/deployments](../../../api/apps/[id]/deployments/AGENTS.md),
[/apps/:id/deployments/:deploymentId](../../../api/apps/[id]/deployments/[deploymentId]/AGENTS.md).
