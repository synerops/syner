# update

Applies a partial change to an app's definition.

## Input

- `id`: the app.
- `name, backend, frontend`: any subset; only the given fields change.

## Output

The app as stored after the change.

## Rules

- Authorization: the principal needs `apps:update` on the app, checked through
  [permissions/authorize](../../permissions/authorize/AGENTS.md).
- Renaming keeps `id` and everything attached to it.
- A definition change deploys nothing; it is captured by the next version.
- Side effect: one [activity](../../activity/record/AGENTS.md) entry with the
  actor, the app and the changed fields, and the outcome.
- Runs in-request. It returns the app, not an
  [operation](../../ops/AGENTS.md).
- The acting principal comes from the request context, never from the input.

## Errors

- `app not found`
- `not authorized`
- `name taken`
- `invalid backend`
