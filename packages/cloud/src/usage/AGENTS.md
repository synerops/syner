# usage

Owns usage records and, through budgets, the limits on them.

## Schema (index)

- `id`: stable.
- `metric`: a name from the fixed list of metrics.
- `quantity`: number, in the metric's unit.
- `organizationId`: required.
- `appId`: optional.
- `principalId`: optional.
- `resource`: `kind` and `id`.
- `period`: hour bucket, UTC.
- `recordedAt`: timestamp.

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

## Verbs

- [record](record/AGENTS.md): appends a consumption
- [get](get/AGENTS.md): aggregates consumption over a period, by app, metric,
  or principal

## Needs from infrastructure

[ports](ports/AGENTS.md): persistence for records and budgets; a pricing
provider that maps quantities to cost.
