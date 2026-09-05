# get

Reads one version of an app.

## Input

- `appId`: the app.
- `number`: the version number, or `id`.

## Output

The version.

## Rules

- Authorization: the principal needs `versions:read` on the app, checked
  through [permissions/authorize](../../../permissions/authorize/AGENTS.md).
- Runs in-request. It returns the version, not an
  [operation](../../../ops/AGENTS.md).
- The acting principal comes from the request context, never from the input.

## Errors

- `app not found`
- `version not found`
- `not authorized`
