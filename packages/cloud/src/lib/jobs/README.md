<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">jobs</h1>

<p align="center">
  <strong>Durable work as a webhook: an HTTP target, what triggers it, and a delivery you can trust.</strong>
</p>

A job is a webhook you own. You give the cloud an HTTP target, say what starts
it, a schedule, a named event, or a manual start, and the cloud delivers a
signed call every time, with retries and backoff, a timeout, a concurrency
limit, and an idempotency key so your endpoint can be called more than once
without doing the work twice. The job is the definition. A run is one
delivery, with its attempts.

## What a job looks like

- **Name.** unique in the organization.
- **Organization, app.** the owner, and optionally the app the target belongs
  to.
- **Target.** the HTTP endpoint that receives the call: a path on one of your
  apps, or an absolute HTTPS URL.
- **Triggers.** what starts a delivery: a schedule, a named event, or a manual
  start.
- **Delivery policy.** attempts and backoff, timeout, concurrency, and the
  secret that signs each call.
- **Enabled.** whether triggers are live.
- **Created by, at.** who and when.

## What it owns

- [runs](runs/README.md): each delivery of the job, with its attempts and
  events.

## Use cases

| File | What it does |
|---|---|
| `create.ts` | Define a webhook: target, triggers, delivery policy. |
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
- **delivery** (provider). fire schedules and events into run starts; deliver
  a signed HTTP call to a target with timeout, retries, and backoff; report
  every attempt; hold undelivered runs durably while the target is down.

## How it relates to the rest

A target is usually an endpoint of one of your [apps](../apps/README.md); an
app that needs [compute](../compute/README.md) calls it from that endpoint.
Runs and their outcomes appear in [activity](../activity/README.md);
deliveries are metered in [usage](../usage/README.md). A run is not an
[operation](../operations/README.md): operations track the cloud's
administration, runs track your work. Syner's own worker is a receiver of this
kind: its jobs deliver administrative work to it.
