# purpose

Part of the app model: a description of what the app is for. No use case of
its own is agreed.

## Model (`purpose.ts`)

- `statement`: one human sentence. Required when a purpose is present.
- `criteria[]`: free text, one per line of the organization's intent. No
  `source` field: evidence is undefined.
- `declaredBy`, `since`: principal and timestamp.

## Established

- The purpose is a field of the app model. It is written through the app's own
  create and update on [`/apps`](../../../api/apps/AGENTS.md) and
  [`/apps/:id`](../../../api/apps/[id]/AGENTS.md); it has no route of its own.

## Rules

- At most one purpose per app; update replaces it whole.
- No evaluation runs anywhere in the cloud until an evidence source is agreed.
- Absence of a purpose, or of evidence, is never reported as failure.

## Pending

- Whether evaluation exists at all, and if so where: inside apps, reported by
  the app, or an independent evaluator.
- The source of business evidence.
- The earlier proposal (`declare`, `evaluate`, `get`; results `met`,
  `partial`, `unmet`) stays documented in README.md and is not an API.
