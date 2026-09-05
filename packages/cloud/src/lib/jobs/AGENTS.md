# jobs

Owns job definitions and, through runs, each occurrence of them.

## Model (`job.ts`)

- `id`: stable.
- `organizationId`: the owner.
- `appId`: optional.
- `name`: unique in the organization.
- `action`: `kind` (`execution` or `app`) with `command` and `runtime`, or
  `appId` and `path`.
- `triggers[]`: each `kind` (`schedule`, `event`, `manual`) with `cron` or
  `event` name.
- `enabled`: boolean.
- `createdBy, createdAt, updatedAt`: principal and timestamps.

## Rules

- A job is a definition; it never carries the status of a run.
- Disabling a job stops its triggers and leaves running runs to finish.
- Removing a job cancels its active runs; finished runs stay readable.
- A run started by a trigger records which trigger; a manual run records who
  started it.

## Owns

- [runs](runs/AGENTS.md): each occurrence of the job, with its status and
  events.

## Use cases

### `create.ts`

Creates a job definition with its triggers.

- Validation: an `app` action names an app the principal can read; a
  `schedule` trigger has a valid cron.
- Side effect: one [activity](../activity/AGENTS.md) entry with the actor, the
  job, and the outcome.

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

## Ports (`ports.ts`)

Interfaces this module requires. Implemented in
[infrastructure](../../../../infrastructure/AGENTS.md), never here; injected
into use cases by api and worker; spoken in this module's own types.

Persistence:

- `jobs`: save, load by id or by organization and name, list by organization,
  app, and enabled, mark removed.
- `runs`: save, load, list by job with filters, append events, update status.

Providers:

- `scheduler`: register and unregister schedules and event subscriptions for a
  job; fire a run start when one triggers.

## Exposure

Exposed through `POST /jobs`, `GET /jobs/:id`, `GET /jobs`, `PATCH /jobs/:id`,
`DELETE /jobs/:id`. Contracts: [/jobs](../../api/jobs/AGENTS.md),
[/jobs/:id](../../api/jobs/[id]/AGENTS.md).
