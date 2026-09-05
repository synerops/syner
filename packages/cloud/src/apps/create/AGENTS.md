# create

Registers the identity of an app in an organization.

## Input

- `organizationId`: the owner.
- `name`: unique within the organization.
- `backend`: `runtime`, `entry`, `env[]`.
- `frontend`: optional.

## Output

The app as stored, with `currentDeploymentId` empty.

## Rules

- Authorization: the principal needs `apps:create` on the organization,
  checked through
  [permissions/authorize](../../permissions/authorize/AGENTS.md).
- When the principal is an agent acting under a delegation, the check applies
  to the human's permissions, never to a wider set.
- Validation: `name` is free in the organization; `backend.runtime` is one the
  cloud knows.
- It registers identity only: it creates no version and no deployment.
- Side effect: one [activity](../../activity/record/AGENTS.md) entry with the
  actor, the app, and the outcome.
- Runs in-request. It returns the app, not an
  [operation](../../ops/AGENTS.md).
- The acting principal comes from the request context, never from the input.

## Errors

- `organization not found`
- `not authorized`
- `name taken`
- `invalid backend`
