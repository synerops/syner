# usage

Owns usage records and, through budgets, the limits on them.

## Model (`usage.ts`)

- `id`: stable.
- `metric`: a name from the fixed list of metrics.
- `quantity`: number, in the metric's unit.
- `organizationId`: required.
- `principalId`: optional.
- `resource`: `kind` and `id`.
- `period`: hour bucket, UTC.
- `recordedAt`: timestamp.
- `appId, environmentId`: optional; consumption caused inside an environment
  names it.

## Rules

- Recording is a business fact: it happens in the use case that caused the
  consumption, never in a client.
- Records are appended; corrections are new records with a negative quantity
  and a reason.
- Metric names and units are fixed here; a record with an unknown metric is
  rejected.
- Cost is derived, never stored: the pricing provider turns quantities into
  money when asked.

## Owns

- [budgets](budgets/AGENTS.md): a limit on a metric or on cost, for an
  organization or an app, and what happens when it is reached.

## Use cases

### `record.ts`

Appends one usage record.

- After the append, budgets in scope are checked; reaching one triggers its
  action and an [activity](../activity/AGENTS.md) entry.

### `get.ts`

Aggregates usage records over a period.

- Cost is computed on read through the pricing provider; absent pricing, rows
  carry quantity only.

## Infrastructure (`infrastructure.ts`)

Interfaces this module requires. Implemented in
[infrastructure](../../../../infrastructure/AGENTS.md), never here; injected
into use cases by api and worker; spoken in this module's own types.

Persistence:

- `records`: append, aggregate by metric, app, principal, and time window;
  fast enough for per-call budget checks.
- `budgets`: save, load by scope, list by organization.

Providers:

- `pricing`: map a metric and quantity to cost in a currency; report whether
  pricing is configured.

## Exposure

Public location pending for `get`: see [api](../../api/AGENTS.md). Nothing
under `api/` exists for it yet. Internal only: `record`. Called by the cloud's
own use cases, never exposed.
