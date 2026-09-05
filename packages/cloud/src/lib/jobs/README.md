<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">jobs</h1>

<p align="center">
  <strong>Durable work: a definition with triggers, and each run of it.</strong>
</p>

A job is work you want to happen without watching it: on a schedule, when an
event arrives, or when someone asks. The job is the definition: what to do and
what starts it. A run is one occurrence. A run can start an execution in
compute or call an app; it is never an environment itself.

## What a job looks like

- **Name.** unique in the organization.
- **Organization, app.** the owner, and optionally the app the job belongs to.
- **Action.** what a run does: start an execution with a command, or call an
  app endpoint.
- **Triggers.** what starts a run: a schedule, a named event, or a manual
  start.
- **Enabled.** whether triggers are live.
- **Created by, at.** who and when.

## What it owns

- [runs](runs/README.md): each occurrence of the job, with its status and
  events.

## Use cases

| File | What it does |
|---|---|
| `create.ts` | Define a job and what starts it. |
| `get.ts` | Read one job. |
| `list.ts` | List the jobs of an organization. |
| `update.ts` | Change a job's action, triggers, or enabled flag. |
| `remove.ts` | Remove a job. |

## Exposure

Exposed through `POST /jobs`, `GET /jobs/:id`, `GET /jobs`, `PATCH /jobs/:id`,
`DELETE /jobs/:id`. Contracts: [/jobs](../../api/jobs/README.md),
[/jobs/:id](../../api/jobs/[id]/README.md).

## What it needs from infrastructure

- **jobs.** save, load by id or by organization and name, list by
  organization, app, and enabled, mark removed.
- **runs.** save, load, list by job with filters, append events, update
  status.
- **scheduler** (provider). register and unregister schedules and event
  subscriptions for a job; fire a run start when one triggers.

## How it relates to the rest

A run may start a [compute execution](../compute/executions/README.md) or call
an [app](../apps/README.md). Runs and their outcomes appear in
[activity](../activity/README.md); their consumption in
[usage](../usage/README.md). A run is not an
[operation](../operations/README.md): operations track administration, runs
track the customer's work.
