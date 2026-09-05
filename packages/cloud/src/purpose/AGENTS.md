# purpose

Owns the purpose of an app: its declaration, its criteria, and the history of
evaluations against them. At most one purpose per app.

## Schema (index)

- `appId`: the app this purpose belongs to. Required.
- `statement`: one human sentence. Required.
- `criteria[]`: each with `name`, `target` (a measurable condition), and
  `source`, the control it's measured from: `activity` or `usage`. At least
  one.
- `declaredBy`: the principal who declared it. `since`: when.
- `evaluations[]`: newest first. Each has `at`, `result` (`met`, `partial`,
  `unmet`) and `evidence[]`, one entry per criterion with what was measured
  and where it came from.

## Rules

- A declaration is replaced whole. The previous statement and criteria stay
  visible through [activity](../activity/AGENTS.md).
- Evaluations are appended, never edited or removed.
- A criterion is measurable only from activity or usage. Any other source is
  rejected at declare time.
- Purpose reads other controls and writes none of them.

## Verbs

- [declare](declare/AGENTS.md): writes or replaces the statement and criteria
- [evaluate](evaluate/AGENTS.md): compares the declaration with activity and
  usage, records a result
- [get](get/AGENTS.md): returns the declaration and its latest evaluation

## Needs from infrastructure

[ports](ports/AGENTS.md): persistence for purposes. Nothing else.
