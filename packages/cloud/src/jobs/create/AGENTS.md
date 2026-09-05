# create

Creates a job definition with its triggers.

## Input

- `organizationId`: the owner.
- `appId`: optional.
- `name`: unique.
- `action`: required.
- `triggers`: at least one.
- `enabled`: optional; true by default.

## Output

The job.

## Rules

- Authorization: the principal needs `jobs:create` on the organization, or the
  app when given, checked through
  [permissions/authorize](../../permissions/authorize/AGENTS.md).
- When the principal is an agent acting under a delegation, the check applies
  to the human's permissions, never to a wider set.
- Validation: an `app` action names an app the principal can read; a
  `schedule` trigger has a valid cron.
- Side effect: one [activity](../../activity/record/AGENTS.md) entry with the
  actor, the job, and the outcome.
- Runs in-request. It returns the job, not an
  [operation](../../ops/AGENTS.md).
- The acting principal comes from the request context, never from the input.

## Errors

- `organization not found`
- `app not found`
- `not authorized`
- `name taken`
- `invalid trigger`
- `invalid action`
