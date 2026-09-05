# environments

Owns the environments of an app: configuration, resources, access, stable
domain, lifetime, and which deployment is promoted to it.

## Model (`environment.ts`)

- `id`: stable.
- `appId`: the app.
- `name`: unique within the app.
- `lifetime`: `persistent` or `temporary`; `expiresAt` optional for temporary.
- `config`: `values` (name to value) and `secrets` (name to secret reference);
  references only, never material.
- `resources`: `connectionIds[]`, `storeIds[]`.
- `access`: who may `deploy` and who may `promote`, as permission bindings on
  this environment.
- `domain`: the stable address.
- `promotedDeploymentId`: optional: the deployment answering at `domain`, set
  when the domain routing provider confirms the switch. The single source of
  truth for what serves traffic here.
- `origin`: optional: `kind` (`branch`, `pull-request`, `automation`,
  `manual`) and `ref`.
- `status`: `active`, `removed`.
- `createdBy, createdAt, updatedAt`: principal and timestamps.

## Rules

- `name` is unique within the app. No name is reserved or created by default;
  whether an app gets a default environment at creation is pending.
- `promotedDeploymentId`, when set, names a deployment of this environment
  whose availability is `available`.
- Creating a deployment never changes the promotion. Promoting a deployment
  never retires another.
- Promotion is long-running: the request is accepted, and
  `promotedDeploymentId` changes only when the domain routing provider
  confirms the domain answers with the new deployment.
- Rollback is promoting an earlier available deployment; it rebuilds nothing.
- Pending, with no default specified: whether a deployment made before a
  configuration change may be promoted as is, or must be deployed again.
- Removing an environment retires its deployments and releases its domain.
  What happens to stores, secrets, and connections it referenced is pending;
  nothing is cloned or cleaned automatically without an explicit contract.
- A temporary environment is one with `lifetime: temporary`; associating it to
  a branch or pull request is optional metadata. Automatic activation and
  cleanup are previewed capabilities, not promised.
- An application environment is not a compute environment. Permissions name it
  as resource kind `environment`; compute's is `compute-environment`.

## Use cases

### `create.ts`

Creates an environment of an app with its configuration, resources, access,
and lifetime.

- Validation: `name` is free in the app; secret references exist; connections
  and stores belong to the organization.
- Which configuration is inherited from another environment, and when it is
  captured into a deployment, is pending; this verb stores what it is given.
- Side effect: one [activity](../../activity/AGENTS.md) entry with the actor,
  the app and the environment, and the outcome.

### `get.ts`

Reads one environment of an app.

### `list.ts`

Lists the environments of an app, paged.

### `update.ts`

Applies a partial change to an environment's definition. Promotion is not
changed here.

- `promotedDeploymentId` is not accepted here; promotion has its own use case.
- When configuration changes reach running deployments is pending.
- Side effect: one [activity](../../activity/AGENTS.md) entry with the actor,
  the environment and the changed fields, and the outcome.

### `promote.ts`

Requests the promotion of an available deployment to the environment's stable
domain; rollback is a promotion of an earlier one.

- The deployment belongs to this environment and is `available`; a `retired`
  or `failed` one is refused.
- Promoting rebuilds nothing.
- Pending, with no default specified: whether a deployment made before a
  configuration change may be promoted as is, or must be deployed again.
- The previously promoted deployment stays available; retiring it is a
  separate decision.
- `promotedDeploymentId` changes only when the domain routing provider
  confirms the switch; until then the operation is `running` and the previous
  deployment keeps answering.
- Side effect: one [activity](../../activity/AGENTS.md) entry with the actor,
  the environment, the previous and the new deployment, and the outcome.

### `remove.ts`

Removes an environment: retires its deployments and releases its domain.

- Deployments are retired first; the domain is released; referenced resources
  are untouched.
- Automatic cleanup of temporary environments at `expiresAt` is a previewed
  capability, not implemented.
- Side effect: one [activity](../../activity/AGENTS.md) entry with the actor,
  the environment, and the outcome.

## Needs from infrastructure

[infrastructure.ts](../infrastructure.ts), the app module's list: persistence
for environments, and a domain routing provider that binds the stable domain
to a deployment's address and confirms when traffic has switched. Saving
`promotedDeploymentId` is not the switch; the provider is.

## Exposure

Exposed through `POST /apps/:id/environments`, `GET
/apps/:id/environments/:environmentId`, `GET /apps/:id/environments`, `PATCH
/apps/:id/environments/:environmentId`, `POST
/apps/:id/environments/:environmentId/promote/:deploymentId`, `DELETE
/apps/:id/environments/:environmentId`. Contracts:
[/apps/:id/environments](../../../api/apps/[id]/environments/AGENTS.md),
[/apps/:id/environments/:environmentId](../../../api/apps/[id]/environments/[environmentId]/AGENTS.md),
[/apps/:id/environments/:environmentId/promote/:deploymentId](../../../api/apps/[id]/environments/[environmentId]/promote/[deploymentId]/AGENTS.md).
