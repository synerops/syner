# jobs

Owns job definitions and, through runs, each occurrence of them.

## Model (`job.ts`)

- `id`: stable.
- `organizationId`: the owner.
- `appId`: optional.
- `name`: unique in the organization.
- `target`: `kind` (`app` or `url`) with `appId` and `path`, or `url` (HTTPS
  only).
- `triggers[]`: each `kind` (`schedule`, `event`, `manual`) with `cron` or
  `event` name.
- `delivery`: `maxAttempts`, `backoff` (`none`, `linear`, `exponential`),
  `timeoutSeconds`, `concurrency`, `signingSecretRef`.
- `enabled`: boolean.
- `createdBy, createdAt, updatedAt`: principal and timestamps.

## Rules

- A job is a definition; it never carries the status of a run.
- Every delivery is signed with the job's secret and carries an idempotency
  key derived from the trigger event; the receiver treats the same key as the
  same event.
- Delivery is at-least-once: a call may be repeated; it is never lost while
  attempts remain.
- Disabling a job stops its triggers and lets runs in flight finish their
  attempts.
- Removing a job cancels its active runs; finished runs stay readable.

## Owns

- [runs](runs/AGENTS.md): each delivery of the job, with its attempts and
  events.

## Use cases

### `create.ts`

Creates a job definition with its triggers.

- Side effect: one [activity](../activity/AGENTS.md) entry with the actor, the
  job, and the outcome.
- Validation: an `app` target names an app the principal can read and a path
  on it; a `url` target is HTTPS; a `schedule` trigger has a valid cron.
- A signing secret is created for the job and stored through the secrets
  vault; the response carries its reference, never the material.

### `get.ts`

Reads one job.

### `list.ts`

Lists the jobs of an organization, paged.

### `update.ts`

Applies a partial change to a job definition.

- Running runs keep the definition they started with.
- Side effect: one [activity](../activity/AGENTS.md) entry with the actor, the
  job and the changed fields, and the outcome.

### `remove.ts`

Removes a job definition and cancels its active runs.

- Active runs are cancelled before the definition goes; their status says
  `cancelled` with the removal as reason.
- Side effect: one [activity](../activity/AGENTS.md) entry with the actor, the
  job and the runs cancelled, and the outcome.

## Infrastructure (`infrastructure.ts`)

Interfaces this module requires. Implemented in
[infrastructure](../../../../infrastructure/AGENTS.md), never here; injected
into use cases by api and worker; spoken in this module's own types.

Persistence:

- `jobs`: save, load by id or by organization and name, list by organization,
  app, and enabled, mark removed.
- `runs`: save, load, list by job with filters, append events, update status.

Providers:

- `delivery`: fire schedules and events into run starts; deliver a signed HTTP
  call to a target with timeout, retries, and backoff; report every attempt;
  hold undelivered runs durably while the target is down.

## Exposure

Exposed through `POST /jobs`, `GET /jobs/:id`, `GET /jobs`, `PATCH /jobs/:id`,
`DELETE /jobs/:id`. Contracts: [/jobs](../../api/jobs/AGENTS.md),
[/jobs/:id](../../api/jobs/[id]/AGENTS.md).
