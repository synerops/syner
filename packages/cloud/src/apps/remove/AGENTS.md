# remove

Removes an app: retires its live deployment and releases its name.

## Input

- `id`: the app.

## Output

An operation reference; its result is the app marked removed.

## Rules

- Authorization: the principal needs `apps:remove` on the app, checked through
  [permissions/authorize](../../permissions/authorize/AGENTS.md).
- The live deployment is retired first; versions and activity remain readable.
- A removed app accepts no further versions or deployments.
- Side effect: one [activity](../../activity/record/AGENTS.md) entry with the
  actor, the app, and the outcome.
- Long-running. It returns an [operation](../../ops/AGENTS.md) reference at
  once; the removed app arrives through it.
- The acting principal comes from the request context, never from the input.

## Errors

- `app not found`
- `not authorized`
- `removal in progress`
