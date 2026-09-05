# apps

Owns the identity of an app and, through the things it owns, its versions and
deployments.

## Schema (index)

- `id`: stable for the app's whole life; never reused.
- `name`: unique within the organization; may change through update.
- `organizationId`: the owner.
- `backend`: `runtime`, `entry`, `env[]` (names of variables the backend
  expects; values live elsewhere).
- `frontend`: optional: `kind` (`static` or `server`) and `entry`.
- `currentDeploymentId`: optional: the live deployment.
- `createdBy`: principal. `createdAt`, `updatedAt`: timestamps.

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

## Verbs

- [create](create/AGENTS.md): registers the app's identity; no version, no
  deployment yet
- [get](get/AGENTS.md): returns the app with its current deployment
- [list](list/AGENTS.md): returns the organization's apps, paged
- [update](update/AGENTS.md): changes name, backend, or frontend definition;
  applies at the next version
- [remove](remove/AGENTS.md): tears down the current deployment and releases
  the name

## Needs from infrastructure

[ports](ports/AGENTS.md): persistence for apps, versions, and deployments; a
deployment target that serves a version; an artifact store that keeps a
version's code.
