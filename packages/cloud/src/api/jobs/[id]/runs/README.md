<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">/jobs/:id/runs</h1>

<p align="center">
  <strong>External contract of `/jobs/:id/runs`.</strong>
</p>

Route marked by `index.ts`, the provisional marker of the scaffold. Methods:
GET, POST. Path parameters: `:id`.

## Below this route

- [`/jobs/:id/runs/:runId`]([runId]/README.md)

### GET /jobs/:id/runs

Returns runs, newest first, in pages.

**Request.** Path: `:id` becomes `jobId`. Headers: `Authorization: Bearer
<token>`. Query: `status, since, until` optional filters.; `cursor, limit`
paging. No body.

**Response.** `200 OK`. A page of runs.

```json
{
  "items": [
    {
      "id": "run_3h9j",
      "jobId": "job_6t8y",
      "startedBy": {
        "principal": "prn_ana"
      },
      "idempotencyKey": "job_6t8y:manual:2026-09-04T18:24:30Z",
      "status": "delivering",
      "attempts": [
        {
          "at": "2026-09-04T18:24:30Z",
          "statusCode": 502,
          "durationMs": 120,
          "error": "Bad Gateway"
        },
        {
          "at": "2026-09-04T18:25:30Z",
          "statusCode": 502,
          "durationMs": 130,
          "error": "Bad Gateway"
        }
      ],
      "events": [
        {
          "at": "2026-09-04T18:24:30Z",
          "kind": "started",
          "message": "delivering to /tasks/close-month"
        },
        {
          "at": "2026-09-04T18:25:30Z",
          "kind": "error",
          "message": "attempt 2 of 5 failed; next in 2m"
        }
      ],
      "createdAt": "2026-09-04T18:24:30Z",
      "finishedAt": null
    }
  ],
  "next": null
}
```

**Authorization.** Authorization: the principal needs `runs:read` on the job,
checked through
[permissions/authorize](../../../../lib/permissions/README.md).

**Errors.** `404` job not found, `403` not authorized.

**Use case.** `list.ts` in
[lib/jobs/runs](../../../../lib/jobs/runs/README.md).

**From the SDK.**

```ts
const page = await syner.jobs.runs.list({
  job: id,
  status: 'failed',
})
```

**Raw, from the CLI.** Flags follow `vercel api` and are a proposal: `-X`
selects the method (GET by default), `-F` adds a field, `--input` reads a body
from a file or `-` for stdin, `-H` adds a header.

```bash
syner api "/jobs/job_6t8y/runs?status=failed"
```

### POST /jobs/:id/runs

Delivers one event to the job's target now, outside its schedule, with a fresh
idempotency key.

Read it with [get]([runId]/README.md) until the status is final.

**Request.** Path: `:id` becomes `jobId`. Headers: `Authorization: Bearer
<token>`. Body:

- `payload`: optional: data the target receives in the body.

**Response.** `201 Created`. The run with status `queued` or `delivering`.

```json
{
  "id": "run_3h9j",
  "jobId": "job_6t8y",
  "startedBy": {
    "principal": "prn_ana"
  },
  "idempotencyKey": "job_6t8y:manual:2026-09-04T18:24:30Z",
  "status": "delivering",
  "attempts": [],
  "events": [
    {
      "at": "2026-09-04T18:24:30Z",
      "kind": "started",
      "message": "delivering to /tasks/close-month"
    }
  ],
  "createdAt": "2026-09-04T18:24:30Z",
  "finishedAt": null
}
```

**Authorization.** Authorization: the principal needs `runs:start` on the job,
checked through
[permissions/authorize](../../../../lib/permissions/README.md). When the
principal is an agent acting under a delegation, the check applies to the
human's permissions, never to a wider set.

**Operation tracking.** Returns the run itself, which carries its own status;
no operation is created.

**Errors.** `404` job not found, `403` not authorized, `409` job removed.

**Use case.** `start.ts` in
[lib/jobs/runs](../../../../lib/jobs/runs/README.md).

**From the SDK.**

```ts
const run = await syner.jobs.runs.start({ job: id })
```

**Raw, from the CLI.** Flags follow `vercel api` and are a proposal: `-X`
selects the method (GET by default), `-F` adds a field, `--input` reads a body
from a file or `-` for stdin, `-H` adds a header.

```bash
syner api /jobs/job_6t8y/runs -X POST
```
