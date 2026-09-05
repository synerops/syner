# runs

Owns runs: each occurrence of a job, with status, events, and what it invoked.

## Model (`run.ts`)

- `id`: stable.
- `jobId`: the job.
- `startedBy`: `trigger` (which one) or `principal` (who).
- `idempotencyKey`: string; unique per event, repeated on every attempt.
- `status`: `queued`, `delivering`, `succeeded`, `failed`, `cancelled`.
- `attempts[]`: each `at`, `statusCode`, `durationMs`, `error`.
- `events[]`: each `at`, `kind` (`started`, `progress`, `finished`, `error`),
  `message`.
- `createdAt, finishedAt`: timestamps.

## Rules

- An attempt succeeds on any 2xx; it is retried on a timeout or a 5xx per the
  job's policy; a 4xx ends the run as failed at once.
- Attempts and events are appended, never edited.
- Transitions: `queued` to `delivering`; `delivering` to `succeeded`,
  `failed`, or `cancelled`.
- A run keeps the job definition it started with, even if the job changes
  meanwhile.
- Cancelling stops further attempts; an attempt already in flight is not
  interrupted.

## Use cases

### `start.ts`

Starts one run of a job.

- A disabled job still accepts a manual start; only its triggers are off.
- Side effect: one [activity](../../activity/AGENTS.md) entry with the actor,
  the job and the run, and the outcome.

### `cancel.ts`

Cancels a run: no further attempts are made.

- Cancelling a finished run changes nothing.
- Side effect: one [activity](../../activity/AGENTS.md) entry with the actor,
  the run, and the outcome.

### `get.ts`

Reads one run.

### `list.ts`

Lists the runs of a job, paged.

## Exposure

Exposed through `POST /jobs/:id/runs`, `PATCH /jobs/:id/runs/:runId/cancel`,
`GET /jobs/:id/runs/:runId`, `GET /jobs/:id/runs`. Contracts:
[/jobs/:id/runs](../../../api/jobs/[id]/runs/AGENTS.md),
[/jobs/:id/runs/:runId](../../../api/jobs/[id]/runs/[runId]/AGENTS.md),
[/jobs/:id/runs/:runId/cancel](../../../api/jobs/[id]/runs/[runId]/cancel/AGENTS.md).
