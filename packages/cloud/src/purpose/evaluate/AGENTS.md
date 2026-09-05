# evaluate

Appends an evaluation of the app's purpose over a window.

## Input

- `appId`: the app.
- `window`: `since` and `until`; defaults to the last full period.

## Output

An operation reference; its result is the evaluation: `at`, `result`,
`evidence[]`.

## Rules

- Authorization: the principal needs `purpose:evaluate` on the app, checked
  through [permissions/authorize](../../permissions/authorize/AGENTS.md).
- Each criterion is measured only from its declared `source`; a criterion that
  cannot be measured yields `unmet` with the reason in its evidence.
- `result` is `met` when every criterion is met, `unmet` when none is,
  `partial` otherwise.
- Evaluate reads activity and usage and writes only to the purpose's
  evaluations.
- Side effect: one [activity](../../activity/record/AGENTS.md) entry with the
  actor, the app and the result, and the outcome.
- Long-running. It returns an [operation](../../ops/AGENTS.md) reference at
  once; the evaluation arrives through it.
- The acting principal comes from the request context, never from the input.

## Errors

- `app not found`
- `purpose not declared`
- `not authorized`
- `invalid window`
