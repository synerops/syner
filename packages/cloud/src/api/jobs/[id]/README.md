<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">/jobs/:id</h1>

<p align="center">
  <strong>External contract of `/jobs/:id`.</strong>
</p>

Route marked by `index.ts`, the provisional marker of the scaffold. Methods:
GET, PATCH, DELETE. Path parameters: `:id`.

## Below this route

- [`/jobs/:id/runs`](runs/README.md)

### GET /jobs/:id

Returns the definition and a summary of its latest run.

See its history with [runs/list](runs/README.md).

**Request.** Path: `:id` becomes `id`. Headers: `Authorization: Bearer
<token>`. No body.

**Response.** `200 OK`. The job with its latest run summary.

```json
{
  "id": "job_6t8y",
  "organizationId": "org_3f9k",
  "appId": "app_7c3a",
  "name": "close-month",
  "target": {
    "kind": "app",
    "appId": "app_7c3a",
    "path": "/tasks/close-month"
  },
  "triggers": [
    {
      "kind": "schedule",
      "cron": "0 2 1 * *"
    },
    {
      "kind": "manual"
    }
  ],
  "delivery": {
    "maxAttempts": 5,
    "backoff": "exponential",
    "timeoutSeconds": 30,
    "concurrency": 1,
    "signingSecretRef": "sec_9q2z"
  },
  "enabled": true,
  "createdBy": "prn_ana",
  "createdAt": "2026-09-04T18:20:00Z",
  "updatedAt": "2026-09-04T18:20:00Z"
}
```

**Authorization.** Authorization: the principal needs `jobs:read` on the job,
checked through [permissions/authorize](../../../lib/permissions/README.md).

**Errors.** `404` job not found, `403` not authorized.

**Use case.** `get.ts` in [lib/jobs](../../../lib/jobs/README.md).

**From the SDK.**

```ts
const job = await syner.jobs.get({
  organization: 'acme',
  name: 'close-month',
})
```

**Raw, from the CLI.** Flags follow `vercel api` and are a proposal: `-X`
selects the method (GET by default), `-F` adds a field, `--input` reads a body
from a file or `-` for stdin, `-H` adds a header.

```bash
syner api /jobs/job_6t8y
```

### PATCH /jobs/:id

Applies to future deliveries. Runs in flight finish under the policy they
started with.

**Request.** Path: `:id` becomes `id`. Headers: `Authorization: Bearer
<token>`. Body:

- `name, target, triggers, delivery, enabled`: any subset.

**Response.** `200 OK`. The job after the change.

```json
{
  "id": "job_6t8y",
  "organizationId": "org_3f9k",
  "appId": "app_7c3a",
  "name": "close-month",
  "target": {
    "kind": "app",
    "appId": "app_7c3a",
    "path": "/tasks/close-month"
  },
  "triggers": [
    {
      "kind": "schedule",
      "cron": "0 2 1 * *"
    },
    {
      "kind": "manual"
    }
  ],
  "delivery": {
    "maxAttempts": 5,
    "backoff": "exponential",
    "timeoutSeconds": 30,
    "concurrency": 1,
    "signingSecretRef": "sec_9q2z"
  },
  "enabled": false,
  "createdBy": "prn_ana",
  "createdAt": "2026-09-04T18:20:00Z",
  "updatedAt": "2026-09-04T18:24:30Z"
}
```

**Authorization.** Authorization: the principal needs `jobs:update` on the
job, checked through
[permissions/authorize](../../../lib/permissions/README.md).

**Errors.** `404` job not found, `403` not authorized, `409` name taken, `422`
invalid trigger, `422` invalid target.

**Use case.** `update.ts` in [lib/jobs](../../../lib/jobs/README.md).

**From the SDK.**

```ts
await syner.jobs.update({
  id,
  enabled: false,
})
```

**Raw, from the CLI.** Flags follow `vercel api` and are a proposal: `-X`
selects the method (GET by default), `-F` adds a field, `--input` reads a body
from a file or `-` for stdin, `-H` adds a header.

```bash
syner api /jobs/job_6t8y -X PATCH -F enabled=False
```

### DELETE /jobs/:id

Cancels active runs and removes the definition. Finished runs stay readable.

**Request.** Path: `:id` becomes `id`. Headers: `Authorization: Bearer
<token>`. No body.

**Response.** `204 No Content`.

**Authorization.** Authorization: the principal needs `jobs:remove` on the
job, checked through
[permissions/authorize](../../../lib/permissions/README.md).

**Errors.** `404` job not found, `403` not authorized.

**Use case.** `remove.ts` in [lib/jobs](../../../lib/jobs/README.md).

**From the SDK.**

```ts
await syner.jobs.remove({ id })
```

**Raw, from the CLI.** Flags follow `vercel api` and are a proposal: `-X`
selects the method (GET by default), `-F` adds a field, `--input` reads a body
from a file or `-` for stdin, `-H` adds a header.

```bash
syner api /jobs/job_6t8y -X DELETE
```
