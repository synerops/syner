# create

Creates the next version of an app from a source.

## Input

- `appId`: the app.
- `source`: `kind` and `ref`, or an upload handle.

## Output

The version with its number and the captured definition.

## Rules

- Authorization: the principal needs `versions:create` on the app, checked
  through [permissions/authorize](../../../permissions/authorize/AGENTS.md).
- The app's backend and frontend are copied into the version as they are at
  that moment.
- The source is fetched or the upload accepted before the version exists; a
  failed fetch creates nothing.
- Side effect: one [activity](../../../activity/record/AGENTS.md) entry with
  the actor, the app and the version number, and the outcome.
- Runs in-request. It returns the version, not an
  [operation](../../../ops/AGENTS.md).
- The acting principal comes from the request context, never from the input.

## Errors

- `app not found`
- `not authorized`
- `invalid source`
- `source unreachable`
