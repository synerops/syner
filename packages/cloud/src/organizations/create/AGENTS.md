# create

Creates an organization with the acting human as owner.

## Input

- `slug`: unique.
- `name`: display name.

## Output

The organization.

## Rules

- Authorization: any authenticated human principal; agents cannot create
  organizations, even under delegation.
- The creator is added as `owner` in the same request.
- Side effect: one [activity](../../activity/record/AGENTS.md) entry with the
  actor, the organization, and the outcome.
- Runs in-request. It returns the organization, not an
  [operation](../../ops/AGENTS.md).
- The acting principal comes from the request context, never from the input.

## Errors

- `not authorized`
- `slug taken`
- `invalid slug`
