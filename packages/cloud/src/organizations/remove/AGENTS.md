# remove

Removes an organization and all its resources.

## Input

- `id`: the organization.
- `confirm`: the slug, typed again.

## Output

An operation reference; its result is the removed organization.

## Rules

- Authorization: the principal needs `organizations:remove` on the
  organization, checked through
  [permissions/authorize](../../permissions/authorize/AGENTS.md).
- Only an `owner` holds this permission; it cannot be delegated to an agent.
- Resources are removed module by module; activity of the removal stays
  readable to former owners.
- Side effect: one [activity](../../activity/record/AGENTS.md) entry with the
  actor, the organization, and the outcome.
- Long-running. It returns an [operation](../../ops/AGENTS.md) reference at
  once; the removed organization arrives through it.
- The acting principal comes from the request context, never from the input.

## Errors

- `organization not found`
- `not authorized`
- `confirmation mismatch`
- `removal in progress`
