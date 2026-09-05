<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">runs</h1>

<p align="center">
  <strong>One delivery of one event to the job's target, with its attempts.</strong>
</p>

A run starts when a trigger fires or when someone asks. The cloud calls the
target with a signed payload and the run's idempotency key. A 2xx ends the run
as succeeded; a timeout or a 5xx is retried per the job's policy; when
attempts run out the run fails and stays readable. Cancelling stops further
attempts. The run is the receipt of the delivery, never the work itself.

## What a run looks like

- **Job.** the definition it came from.
- **Started by.** the trigger that fired, or the principal who asked.
- **Idempotency key.** one per event; the same key means the same event on
  every attempt.
- **Status.** queued, delivering, succeeded, failed, or cancelled.
- **Attempts.** each call made: when, the status code, how long, the error if
  any.
- **Events.** what happened, in order, with times.
- **Started at, finished at.** when.

## Use cases

| File | What it does |
|---|---|
| `start.ts` | Deliver now. |
| `cancel.ts` | Stop a run. |
| `get.ts` | Read one run. |
| `list.ts` | List the runs of a job. |

## Exposure

Exposed through `POST /jobs/:id/runs`, `PATCH /jobs/:id/runs/:runId/cancel`,
`GET /jobs/:id/runs/:runId`, `GET /jobs/:id/runs`. Contracts:
[/jobs/:id/runs](../../../api/jobs/[id]/runs/README.md),
[/jobs/:id/runs/:runId](../../../api/jobs/[id]/runs/[runId]/README.md),
[/jobs/:id/runs/:runId/cancel](../../../api/jobs/[id]/runs/[runId]/cancel/README.md).

## How it relates to the rest

A run delivers to the target defined in [jobs](../README.md). Its events feed
[activity](../../activity/README.md). It is distinct from an
[operation](../../operations/README.md).
