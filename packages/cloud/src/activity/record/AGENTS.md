# record

Appends one activity entry.

## Input

- `organizationId`: required.
- `actor`: principal and optional delegation.
- `action`: the verb name.
- `resource`: kind and id.
- `outcome`: required.
- `details`: optional summary.

## Output

The entry.

## Rules

- Authorization: internal; only cloud use cases call it.
- Validation: `details` is rejected if it contains a field the cloud marks as
  secret.
- Runs in-request. It returns the entry, not an
  [operation](../../ops/AGENTS.md).
- The acting principal comes from the request context, never from the input.

## Errors

`organization not found`, `unknown action`, `secret in details`.
