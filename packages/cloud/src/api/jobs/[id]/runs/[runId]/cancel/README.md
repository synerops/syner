<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">/jobs/:id/runs/:runId/cancel</h1>

<p align="center">
  <strong>External contract of `/jobs/:id/runs/:runId/cancel`.</strong>
</p>

Route marked by `index.ts`, the provisional marker of the scaffold. Methods:
PATCH. Path parameters: `:id`, `:runId`.

### PATCH /jobs/:id/runs/:runId/cancel

Stops further attempts of a queued or delivering run. An attempt already in
flight is not interrupted.

Cancellation asks the work to stop. It keeps the record, and it does not
promise an immediate stop: the status becomes `cancelled` when the runtime
confirms. Pattern from Vercel, `PATCH /v12/deployments/{id}/cancel`, which
answers with the deployment in `CANCELED` and `400` when it can no longer be
cancelled; here a finished thing is returned unchanged with `200`.

**Request.** Path: `:id` becomes `jobId`, `:runId` becomes `id`. Headers:
`Authorization: Bearer <token>`. No body.

**Response.** `200 OK`. The run with status `cancelled`, or its current final
status if it had already ended.

```json
{
  "id": "run_3h9j",
  "jobId": "job_6t8y",
  "startedBy": {
    "principal": "prn_ana"
  },
  "idempotencyKey": "job_6t8y:manual:2026-09-04T18:24:30Z",
  "status": "cancelled",
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
      "at": "2026-09-04T18:24:30Z",
      "kind": "finished",
      "message": "cancelled by prn_ana; no further attempts"
    }
  ],
  "createdAt": "2026-09-04T18:24:30Z",
  "finishedAt": "2026-09-04T18:24:30Z"
}
```

**Authorization.** Authorization: the principal needs `runs:cancel` on the
job, checked through
[permissions/authorize](../../../../../../lib/permissions/README.md).

**Errors.** `404` run not found, `403` not authorized.

**Use case.** `cancel.ts` in
[lib/jobs/runs](../../../../../../lib/jobs/runs/README.md).

**From the SDK.**

```ts
await syner.jobs.runs.cancel({ id })
```

**Raw, from the CLI.** Flags follow `vercel api` and are a proposal: `-X`
selects the method (GET by default), `-F` adds a field, `--input` reads a body
from a file or `-` for stdin, `-H` adds a header.

```bash
syner api /jobs/job_6t8y/runs/run_3h9j/cancel -X PATCH
```
