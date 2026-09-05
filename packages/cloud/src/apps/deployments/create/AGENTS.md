# create

Creates a deployment of a version and drives it to live.

## Input

- `appId`: the app.
- `versionId or number`: the version.
- `target`: optional; the cloud's default target when omitted.

## Output

An operation reference; its result is the deployment, live or failed.

## Rules

- Authorization: the principal needs `deployments:create` on the app, checked
  through [permissions/authorize](../../../permissions/authorize/AGENTS.md).
- When the deployment becomes live, it becomes the app's current deployment
  and the previous live one becomes retired.
- A failed deployment leaves the previous live deployment untouched.
- Side effect: one [activity](../../../activity/record/AGENTS.md) entry with
  the actor, the app, the version, and the deployment, and the outcome.
- Long-running. It returns an [operation](../../../ops/AGENTS.md) reference at
  once; the deployment arrives through it.
- The acting principal comes from the request context, never from the input.

## Errors

`app not found`, `version not found`, `not authorized`, `deployment in progress`, `target unavailable`.
