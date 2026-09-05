<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">runs</h1>

<p align="center">
  <strong>One occurrence of a job.</strong>
</p>

A run starts when a trigger fires or when someone asks. It does what the job's
action says, appends events as it goes, and ends succeeded, failed, or
cancelled. It references the execution or the app call it made; it is never an
environment itself.

## What a run looks like

- **Job.** the definition it came from.
- **Started by.** the trigger that fired, or the principal who asked.
- **Status.** queued, running, succeeded, failed, or cancelled.
- **Events.** what happened, in order: started, progress, finished, with
  times.
- **Reference.** the execution or the app call the run made.
- **Started at, finished at.** when.

## What you can do with it

| Verb | Who | What happens |
|---|---|---|
| [start](start/README.md) | a member with run rights, an agent, or the scheduler | starts a run now |
| [cancel](cancel/README.md) | whoever can update the job | stops a queued or running run |
| [get](get/README.md) | anyone who can read the job | returns the run with its events |
| [list](list/README.md) | anyone who can read the job | returns the job's runs, newest first |

## How it relates to the rest

A run may hold a [compute execution](../../compute/executions/README.md). Its
events feed [activity](../../activity/README.md). It is distinct from an
[operation](../../ops/README.md).
