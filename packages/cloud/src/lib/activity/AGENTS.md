# activity

Owns the append-only history of actions: actor, action, resource, outcome,
details.

## Model (`activity.ts`)

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

## Use cases

### `record.ts`

Appends one activity entry.

- Validation: `details` is rejected if it contains a field the cloud marks as
  secret.

### `list.ts`

Lists activity entries of an organization, paged.

## Ports (`ports.ts`)

Interfaces this module requires. Implemented in
[infrastructure](../../../../infrastructure/AGENTS.md), never here; injected
into use cases by api and worker; spoken in this module's own types.

Persistence:

- `entries`: append; list by organization with filters on resource, actor,
  action, outcome, and time; never update or delete inside retention.

## Exposure

Public location pending for `list`: see [api](../../api/AGENTS.md). Nothing
under `api/` exists for it yet. Internal only: `record`. Called by the cloud's
own use cases, never exposed.
