<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">executions</h1>

<p align="center">
  <strong>One run of a command inside an environment, with its result.</strong>
</p>

An execution is what happens when an agent runs code: a command starts in an
environment, produces output while it lasts, and ends with an exit code and
whatever it left behind. The execution carries its own status; you read it
directly, it is not an operation.

## What an execution looks like

- **Environment.** where it ran; allocated on the fly when none was given.
- **Command and input.** what was run and what it received.
- **Status.** queued, running, succeeded, failed, or cancelled.
- **Result.** exit code, output, and artifacts it produced.
- **Started by, at; finished at.** who and when.

## Use cases

| File | What it does |
|---|---|
| `start.ts` | Run a command in an environment. |
| `cancel.ts` | Stop a running execution. |
| `get.ts` | Read one execution. |
| `list.ts` | List executions. |

## Exposure

Exposed through `POST /compute/executions`, `PATCH
/compute/executions/:id/cancel`, `GET /compute/executions/:id`, `GET
/compute/executions`. Contracts:
[/compute/executions](../../../api/compute/executions/README.md),
[/compute/executions/:id](../../../api/compute/executions/[id]/README.md),
[/compute/executions/:id/cancel](../../../api/compute/executions/[id]/cancel/README.md).

## How it relates to the rest

Runs inside an [environment](../environments/README.md). A
[job](../../jobs/README.md) that needs compute delivers to an app endpoint
that starts one. Output and artifacts can be kept in
[storage](../../storage/README.md). Time and resources are metered in
[usage](../../usage/README.md).
