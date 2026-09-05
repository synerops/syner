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
      "status": "failed",
      "events": [
        {
          "at": "2026-09-04T18:24:30Z",
          "kind": "started",
          "message": "calling /tasks/close-month"
        },
        {
          "at": "2026-09-04T18:24:30Z",
          "kind": "error",
          "message": "502 Bad Gateway"
        }
      ],
      "reference": {
        "appCall": {
          "path": "/tasks/close-month",
          "statusCode": 502
        }
      },
      "createdAt": "2026-09-04T18:24:30Z",
      "finishedAt": "2026-09-04T18:24:30Z"
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

Runs the job's action once, outside its schedule.

Read it with [get]([runId]/README.md) until the status is final.

**Request.** Path: `:id` becomes `jobId`. Headers: `Authorization: Bearer
<token>`. Body:

- `input`: optional: parameters the action accepts.

**Response.** `201 Created`. The run with status `queued` or `running`.

```json
{
  "id": "run_3h9j",
  "jobId": "job_6t8y",
  "startedBy": {
    "principal": "prn_ana"
  },
  "status": "running",
  "events": [
    {
      "at": "2026-09-04T18:24:30Z",
      "kind": "started",
      "message": "calling /tasks/close-month"
    }
  ],
  "reference": {
    "appCall": {
      "path": "/tasks/close-month",
      "statusCode": null
    }
  },
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
