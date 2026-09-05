<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">/jobs</h1>

<p align="center">
  <strong>External contract of `/jobs`.</strong>
</p>

Route marked by `index.ts`, the provisional marker of the scaffold. Methods:
GET, POST. Path parameters: none.

## Below this route

- [`/jobs/:id`]([id]/README.md)

### GET /jobs

Returns jobs, newest first, in pages.

**Request.** Headers: `Authorization: Bearer <token>`. Query: `organizationId`
required.; `appId, enabled` optional filters.; `cursor, limit` paging. No
body.

**Response.** `200 OK`. A page of jobs.

```json
{
  "items": [
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
  ],
  "next": null
}
```

**Authorization.** Authorization: the principal needs `jobs:read` on the
organization, checked through
[permissions/authorize](../../lib/permissions/README.md).

**Errors.** `404` organization not found, `403` not authorized.

**Use case.** `list.ts` in [lib/jobs](../../lib/jobs/README.md).

**From the SDK.**

```ts
const page = await syner.jobs.list({ organization: 'acme' })
```

**Raw, from the CLI.** Flags follow `vercel api` and are a proposal: `-X`
selects the method (GET by default), `-F` adds a field, `--input` reads a body
from a file or `-` for stdin, `-H` adds a header.

```bash
syner api "/jobs?organizationId=org_3f9k"
```

### POST /jobs

Name the job, point it at an HTTP target, say what starts it, and set how
deliveries are retried and signed. Nothing runs until a trigger fires or
someone starts a run.

Start one by hand with [runs/start]([id]/runs/README.md) to try it.

**Request.** Headers: `Authorization: Bearer <token>`. Body:

- `organizationId`: the owner.
- `appId`: optional.
- `name`: unique.
- `target`: required: an app path or an HTTPS URL.
- `triggers`: at least one.
- `delivery`: optional; the cloud's defaults apply.
- `enabled`: optional; true by default.

**Response.** `201 Created`. The job.

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

**Authorization.** Authorization: the principal needs `jobs:create` on the
organization, or the app when given, checked through
[permissions/authorize](../../lib/permissions/README.md). When the principal
is an agent acting under a delegation, the check applies to the human's
permissions, never to a wider set.

**Errors.** `404` organization not found, `404` app not found, `403` not
authorized, `409` name taken, `422` invalid trigger, `422` invalid target.

**Use case.** `create.ts` in [lib/jobs](../../lib/jobs/README.md).

**From the SDK.**

```ts
const job = await syner.jobs.create({
  organization: 'acme',
  app: 'billing',
  name: 'close-month',
  target: {
    kind: 'app',
    path: '/tasks/close-month',
  },
  triggers: [
    { kind: 'schedule', cron: '0 2 1 * *' },
    { kind: 'manual' },
  ],
  delivery: {
    maxAttempts: 5,
    backoff: 'exponential',
    timeoutSeconds: 30,
  },
})
```

**Raw, from the CLI.** Flags follow `vercel api` and are a proposal: `-X`
selects the method (GET by default), `-F` adds a field, `--input` reads a body
from a file or `-` for stdin, `-H` adds a header.

```bash
syner api /jobs -X POST --input - <<'JSON'
{
  "organizationId": "org_3f9k",
  "appId": "app_7c3a",
  "name": "close-month",
  "target": {
    "kind": "app",
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
    "timeoutSeconds": 30
  }
}
JSON
```
