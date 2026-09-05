# activity

Owns the append-only history of actions: actor, action, resource, outcome,
details.

## Schema (index)

- `id`: stable.
- `organizationId`: required.
- `actor`: `principalId` and optional `delegationId` with `onBehalfOf`.
- `action`: `<module>/<thing>/<verb>` or `<module>/<verb>`.
- `resource`: `kind` and `id`.
- `outcome`: `succeeded`, `failed`, `denied`.
- `details`: JSON: `before`, `after`, or `reason`. Never secret material.
- `at`: timestamp.

## Rules

- Entries are appended, never edited or removed within the retention period.
- Record is called by cloud use cases only; the API exposes no route for it.
- Details carry summaries, never credentials, tokens, or file bodies.
- An entry for an agent under delegation always names the human it acted for.

## Verbs

- [record](record/AGENTS.md): appends an entry
- [list](list/AGENTS.md): returns entries by organization, resource, actor, or
  window

## Needs from infrastructure

[ports](ports/AGENTS.md): append-only persistence for entries, queryable by
organization, resource, actor, and time.
