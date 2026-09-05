# jobs

Owns job definitions and, through runs, each occurrence of them.

## Schema (index)

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

## Verbs

- [create](create/AGENTS.md): defines the job and its triggers
- [get](get/AGENTS.md): returns the definition
- [list](list/AGENTS.md): returns the organization's jobs
- [update](update/AGENTS.md): changes action, triggers, or enabled
- [remove](remove/AGENTS.md): cancels active runs and removes the definition

## Needs from infrastructure

[ports](ports/AGENTS.md): persistence for jobs and runs; a scheduler that
fires schedules and events into run starts.
