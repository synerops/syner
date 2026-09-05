# declare

Writes the statement and criteria of an app's purpose. Replaces any previous
declaration whole.

## Input

- `appId, statement, criteria[]`: as defined in the [purpose
  schema](../AGENTS.md#schema-index).

## Output

The purpose as stored, with `declaredBy` and `since` filled in and
`evaluations` untouched.

## Rules

- Authorization: the principal needs `purpose:declare` on the app, checked
  through [permissions/authorize](../../permissions/authorize/AGENTS.md).
- Validation: every criterion names a `source` of `activity` or `usage`.
  Otherwise the whole declaration is rejected and nothing is written.
- Side effect: one [activity](../../activity/record/AGENTS.md) entry with the
  actor, the app, with the previous statement and criteria inside the entry
  when they existed, and the outcome.
- Runs in-request. It returns the purpose, not an
  [operation](../../ops/AGENTS.md).
- The acting principal comes from the request context, never from the input.

## Errors

`app not found`, `not authorized`, `invalid criterion source`.
