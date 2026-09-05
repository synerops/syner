<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">ops</h1>

<p align="center">
  <strong>A long-running administration action you can follow.</strong>
</p>

Some things the cloud does take longer than a request: deploying, rolling
back, removing an app, provisioning a store, evaluating a purpose. Each of
those returns an operation at once and finishes later. The operation is how
you follow it: its status, its progress, and, at the end, its result or its
error. Together with deployments, this is what answers "is it working?" in
Syner OS.

## What an operation looks like

- **Kind and resource.** what it does and to what: deploy app billing, remove
  store invoices.
- **Status.** pending, running, succeeded, failed, or cancelled.
- **Progress.** step of steps, with a message.
- **Result or error.** what it produced, or why it stopped.
- **Started by, at; finished at.** who asked, and when.

## Use cases

| File | What it does |
|---|---|
| `get.ts` | Read one operation. |
| `list.ts` | List operations. |
| `cancel.ts` | Ask an operation to stop. |

## Exposure

Public location pending for `get`, `list`, `cancel`: see
[api](../../api/README.md). Nothing under `api/` exists for it yet.

## What it needs from infrastructure

- **operations.** save, load, list by organization or resource with filters,
  update status, progress, result, error.

## How it relates to the rest

Operations are created by verbs in other modules, never by a client:
[deployments/create](../apps/deployments/README.md),
[apps/remove](../apps/README.md),
[stores/create](../storage/stores/README.md),
[purpose/evaluate](../apps/purpose/README.md), and others. An operation is not
a [compute execution](../compute/executions/README.md) and not a [job
run](../jobs/runs/README.md): those are the customer's work; operations are
the cloud's administration. Every operation leaves an
[activity](../activity/README.md) entry when it ends.
