# apps

Owns the identity of an app and, through the things it owns, its versions and
deployments.

## Model (`app.ts`)

- `id`: stable for the app's whole life; never reused.
- `name`: unique within the organization; may change through update.
- `organizationId`: the owner.
- `backend`: `runtime`, `entry`, `env[]` (names of variables the backend
  expects; values live elsewhere).
- `frontend`: optional: `kind` (`static` or `server`) and `entry`.
- `currentDeploymentId`: optional: the live deployment.
- `createdBy`: principal. `createdAt`, `updatedAt`: timestamps.
- `purpose`: optional: `statement`, `criteria[]`, `declaredBy`, `since`.
  Described in purpose/.
- `currentDeployment`: read model: `id`, `status`, `url` of the live
  deployment; derived, never stored twice.

## Rules

- `name` is unique within the organization at all times.
- `id` never changes; renaming keeps every version, deployment, and activity
  entry attached.
- An app with no version and no deployment is a valid app.
- Removing an app tears down its deployments and releases its name; its
  versions and activity stay readable by the organization.
- An app belongs to exactly one organization and never moves.

## Owns

- [versions](versions/AGENTS.md): immutable snapshots of the app's code and
  configuration.
- [deployments](deployments/AGENTS.md): a version put into service, with its
  status and URL.

## Declares

- [purpose](purpose/AGENTS.md): part of the app model. No evaluation use case
  exists; see its pending section.

## Use cases

### `create.ts`

Registers the identity of an app in an organization.

- Validation: `name` is free in the organization; `backend.runtime` is one the
  cloud knows.
- It registers identity only: it creates no version and no deployment.
- Side effect: one [activity](../activity/AGENTS.md) entry with the actor, the
  app, and the outcome.

### `get.ts`

Reads one app by id, or by organization and name.

### `list.ts`

Lists the apps of an organization, paged.

- Apps the principal cannot read are omitted, never shown as errors.

### `update.ts`

Applies a partial change to an app's definition.

- `purpose` is replaced whole; there is no partial edit of statement or
  criteria.
- Renaming keeps `id` and everything attached to it.
- A definition change deploys nothing; it is captured by the next version.
- Side effect: one [activity](../activity/AGENTS.md) entry with the actor, the
  app and the changed fields, and the outcome.

### `remove.ts`

Removes an app: retires its live deployment and releases its name.

- The live deployment is retired first; versions and activity remain readable.
- A removed app accepts no further versions or deployments.
- Side effect: one [activity](../activity/AGENTS.md) entry with the actor, the
  app, and the outcome.

## Ports (`ports.ts`)

Interfaces this module requires. Implemented in
[infrastructure](../../../../infrastructure/AGENTS.md), never here; injected
into use cases by api and worker; spoken in this module's own types.

Persistence:

- `apps`: save, load by id or by organization and name, list by organization,
  mark removed.
- `versions`: save, load by app and number, list by app; append-only.
- `deployments`: save, load, list by app and status, update status.

Providers:

- `deployment target`: put a version into service at a target and report its
  URL; retire a deployment; report status.
- `artifacts`: store a version's captured code and hand it back to the
  deployment target.

## Exposure

Exposed through `POST /apps`, `GET /apps/:id`, `GET /apps`, `PATCH /apps/:id`,
`DELETE /apps/:id`. Contracts: [/apps](../../api/apps/AGENTS.md),
[/apps/:id](../../api/apps/[id]/AGENTS.md).
