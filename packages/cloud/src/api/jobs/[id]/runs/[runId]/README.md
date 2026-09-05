<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">/jobs/:id/runs/:runId</h1>

<p align="center">
  <strong>External contract of `/jobs/:id/runs/:runId`.</strong>
</p>

Route marked by `index.ts`, the provisional marker of the scaffold. Methods:
GET. Path parameters: `:id`, `:runId`.

## Below this route

- [`/jobs/:id/runs/:runId/cancel`](cancel/README.md)

### GET /jobs/:id/runs/:runId

Returns the run with its attempts and events.

**Request.** Path: `:id` becomes `jobId`, `:runId` becomes `id`. Headers:
`Authorization: Bearer <token>`. No body.

**Response.** `200 OK`. The run.

```json
{
  "id": "run_3h9j",
  "jobId": "job_6t8y",
  "startedBy": {
    "principal": "prn_ana"
  },
  "idempotencyKey": "job_6t8y:manual:2026-09-04T18:24:30Z",
  "status": "succeeded",
  "attempts": [
    {
      "at": "2026-09-04T18:24:30Z",
      "statusCode": 200,
      "durationMs": 840,
      "error": null
    }
  ],
  "events": [
    {
      "at": "2026-09-04T18:24:30Z",
      "kind": "started",
      "message": "delivering to /tasks/close-month"
    },
    {
      "at": "2026-09-04T18:24:30Z",
      "kind": "finished",
      "message": "200 OK on attempt 1"
    }
  ],
  "createdAt": "2026-09-04T18:24:30Z",
  "finishedAt": "2026-09-04T18:24:30Z"
}
```

**Authorization.** Authorization: the principal needs `runs:read` on the job,
checked through
[permissions/authorize](../../../../../lib/permissions/README.md).

**Errors.** `404` run not found, `403` not authorized.

**Use case.** `get.ts` in
[lib/jobs/runs](../../../../../lib/jobs/runs/README.md).

**From the SDK.**

```ts
const run = await syner.jobs.runs.get({ id })
```

**Raw, from the CLI.** Flags follow `vercel api` and are a proposal: `-X`
selects the method (GET by default), `-F` adds a field, `--input` reads a body
from a file or `-` for stdin, `-H` adds a header.

```bash
syner api /jobs/job_6t8y/runs/run_3h9j
```
