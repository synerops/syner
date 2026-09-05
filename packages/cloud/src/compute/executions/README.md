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

## What you can do with it

| Verb | Who | What happens |
|---|---|---|
| [start](start/README.md) | an agent or a member with compute rights | runs a command; allocates an environment when needed |
| [cancel](cancel/README.md) | whoever started it, or compute rights | stops it; status becomes cancelled |
| [get](get/README.md) | anyone who can read it | returns the execution with its status and result |
| [list](list/README.md) | anyone who can read the environment or organization | returns executions, newest first |

## How it relates to the rest

Runs inside an [environment](../environments/README.md). A [job
run](../../jobs/runs/README.md) may start one. Output and artifacts can be
kept in [storage](../../storage/README.md). Time and resources are metered in
[usage](../../usage/README.md).
