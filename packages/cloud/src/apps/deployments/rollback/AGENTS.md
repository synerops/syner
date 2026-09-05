# rollback

Creates a deployment of a previous version and drives it to live.

## Input

- `appId`: the app.
- `to`: optional: a deployment id or version number; defaults to the
  previously live deployment.

## Output

An operation reference; its result is the new deployment and a note that data
migrations are not reversed.

## Rules

- Authorization: the principal needs `deployments:rollback` on the app,
  checked through
  [permissions/authorize](../../../permissions/authorize/AGENTS.md).
- Rollback never mutates an existing deployment; it creates one.
- Without `to`, the target is the deployment that was live before the current
  one; with none, the call fails.
- Side effect: one [activity](../../../activity/record/AGENTS.md) entry with
  the actor, the app, the version rolled back to, and the outcome.
- Long-running. It returns an [operation](../../../ops/AGENTS.md) reference at
  once; the new deployment arrives through it.
- The acting principal comes from the request context, never from the input.

## Errors

- `app not found`
- `nothing to roll back to`
- `not authorized`
- `deployment in progress`
