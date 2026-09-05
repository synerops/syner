# runs

Owns runs: each occurrence of a job, with status, events, and what it invoked.

## Schema (index)

- `id`: stable.
- `jobId`: the job.
- `startedBy`: `trigger` (which one) or `principal` (who).
- `status`: `queued`, `running`, `succeeded`, `failed`, `cancelled`.
- `events[]`: each `at`, `kind` (`started`, `progress`, `finished`, `error`),
  `message`.
- `reference`: optional: `executionId` or `appCall` (path, status code).
- `createdAt, finishedAt`: timestamps.

## Rules

- Events are appended, never edited.
- Transitions: `queued` to `running`; `running` to `succeeded`, `failed`, or
  `cancelled`.
- A run keeps the job definition it started with, even if the job changes
  meanwhile.
- Cancelling a run cancels the execution it started, when it started one.

## Verbs

- [start](start/AGENTS.md): starts a run now
- [cancel](cancel/AGENTS.md): stops a queued or running run
- [get](get/AGENTS.md): returns the run with its events
- [list](list/AGENTS.md): returns the job's runs, newest first
