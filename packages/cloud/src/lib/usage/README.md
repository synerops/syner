<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">usage</h1>

<p align="center">
  <strong>What was consumed, by whom, and the budgets against it.</strong>
</p>

Every capability consumes something: seconds of compute, bytes of storage,
writes, calls through a connection, job runs. Usage records each consumption
with who caused it: the organization, the app, the principal, the resource.
Budgets set limits on it. This is the control behind "what is it costing?" in
Syner OS.

## What a usage record looks like

- **Metric.** what was consumed: compute seconds, storage bytes, document
  writes, file bytes, connection calls, runs.
- **Quantity.** how much.
- **Attribution.** organization, app and environment when there are,
  principal, and the resource.
- **Period.** the hour it falls in.

## What it owns

- [budgets](budgets/README.md): a limit on a metric or on cost, for an
  organization or an app, and what happens when it is reached.

## Use cases

| File | What it does |
|---|---|
| `record.ts` | Append a consumption. |
| `get.ts` | Aggregate consumption over a period. |

## Exposure

Public location pending for `get`: see [api](../../api/README.md). Nothing
under `api/` exists for it yet. Internal only: `record`. Called by the cloud's
own use cases, never exposed.

## What it needs from infrastructure

- **records.** append, aggregate by metric, app, principal, and time window;
  fast enough for per-call budget checks.
- **budgets.** save, load by scope, list by organization.
- **pricing** (provider). map a metric and quantity to cost in a currency;
  report whether pricing is configured.

## How it relates to the rest

[Compute](../compute/README.md), [storage](../storage/README.md),
[connections](../connections/README.md), and [jobs](../jobs/README.md) record
here. [Budgets](budgets/README.md) read it. Turning quantities into money is a
pricing decision made in infrastructure, through
[infrastructure.ts](infrastructure.ts).
