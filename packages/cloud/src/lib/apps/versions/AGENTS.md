# versions

Owns the versions of an app: immutable, numbered snapshots.

## Model (`version.ts`)

- `id`: stable.
- `appId`: the app.
- `number`: strictly increasing per app.
- `source`: `kind` (`git` or `upload`), `ref`, `commit` when known,
  `artifactId`.
- `backend, frontend`: copied from the app at capture time.
- `createdBy, createdAt`: principal and timestamp.

## Rules

- A version is immutable after creation.
- Numbers strictly increase per app and are never reused.
- Creating a version deploys nothing.
- The code itself lives in the artifact store declared in
  [ports](../AGENTS.md); the version holds the reference.

## Use cases

### `create.ts`

Creates the next version of an app from a source.

- The app's backend and frontend are copied into the version as they are at
  that moment.
- The source is fetched or the upload accepted before the version exists; a
  failed fetch creates nothing.
- Side effect: one [activity](../../activity/AGENTS.md) entry with the actor,
  the app and the version number, and the outcome.

### `get.ts`

Reads one version of an app.

### `list.ts`

Lists the versions of an app, paged.

## Exposure

Exposed through `POST /apps/:id/versions`, `GET
/apps/:id/versions/:versionId`, `GET /apps/:id/versions`. Contracts:
[/apps/:id/versions](../../../api/apps/[id]/versions/AGENTS.md),
[/apps/:id/versions/:versionId](../../../api/apps/[id]/versions/[versionId]/AGENTS.md).
