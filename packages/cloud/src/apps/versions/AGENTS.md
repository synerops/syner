# versions

Owns the versions of an app: immutable, numbered snapshots.

## Schema (index)

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
  [ports](../ports/AGENTS.md); the version holds the reference.

## Verbs

- [create](create/AGENTS.md): captures code and definition into a new number
- [get](get/AGENTS.md): returns one version
- [list](list/AGENTS.md): returns the app's versions, newest first
