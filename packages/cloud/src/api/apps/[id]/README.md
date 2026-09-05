<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">/apps/:id</h1>

<p align="center">
  <strong>External contract of `/apps/:id`.</strong>
</p>

Route marked by `index.ts`, the provisional marker of the scaffold. Methods:
GET, PATCH, DELETE. Path parameters: `:id`.

## Below this route

- [`/apps/:id/deployments`](deployments/README.md)
- [`/apps/:id/environments`](environments/README.md)
- [`/apps/:id/versions`](versions/README.md)

### GET /apps/:id

Returns the app as the organization sees it: its definition and, when there is
one, the deployment serving traffic.

To see its history use [versions/list](versions/README.md) and
[deployments/list](deployments/README.md).

**Request.** Path: `:id` becomes `id`. Headers: `Authorization: Bearer
<token>`. No body.

**Response.** `200 OK`. The app, with its `environments` summary: each
environment's `id`, `name`, `url`, and `promotedDeploymentId`.

```json
{
  "id": "app_7c3a",
  "name": "billing",
  "organizationId": "org_3f9k",
  "backend": {
    "runtime": "node",
    "entry": "src/server.ts",
    "env": [
      "STRIPE_KEY",
      "LOG_LEVEL"
    ]
  },
  "frontend": null,
  "environments": [
    {
      "id": "aenv_5r8t",
      "name": "production",
      "url": "https://billing.acme.syner.app",
      "promotedDeploymentId": "dep_2b7q"
    },
    {
      "id": "aenv_7p1q",
      "name": "pr-42",
      "url": "https://pr-42-billing.acme.syner.app",
      "promotedDeploymentId": null
    }
  ],
  "createdBy": "prn_ana",
  "createdAt": "2026-09-04T18:20:00Z",
  "updatedAt": "2026-09-04T18:24:30Z"
}
```

**Authorization.** Authorization: the principal needs `apps:read` on the app,
checked through [permissions/authorize](../../../lib/permissions/README.md).

**Errors.** `404` app not found, `403` not authorized.

**Use case.** `get.ts` in [lib/apps](../../../lib/apps/README.md).

**From the SDK.**

```ts
const app = await syner.apps.get({
  organization: 'acme',
  name: 'billing',
})
```

**Raw, from the CLI.** Flags follow `vercel api` and are a proposal: `-X`
selects the method (GET by default), `-F` adds a field, `--input` reads a body
from a file or `-` for stdin, `-H` adds a header.

```bash
syner api /apps/app_7c3a
```

### PATCH /apps/:id

Updating changes what the app is, not what is running. A new backend entry
point or a new frontend applies to the next version you create; the live
deployment keeps serving the version it was given.

**Request.** Path: `:id` becomes `id`. Headers: `Authorization: Bearer
<token>`. Body:

- `name, backend, frontend, purpose`: any subset; only the given fields
  change. `purpose` is replaced whole.

**Response.** `200 OK`. The app as stored after the change.

```json
{
  "id": "app_7c3a",
  "name": "billing",
  "organizationId": "org_3f9k",
  "backend": {
    "runtime": "node",
    "entry": "src/main.ts",
    "env": [
      "STRIPE_KEY",
      "LOG_LEVEL"
    ]
  },
  "frontend": null,
  "environments": [
    {
      "id": "aenv_5r8t",
      "name": "production",
      "url": "https://billing.acme.syner.app",
      "promotedDeploymentId": "dep_2b7q"
    },
    {
      "id": "aenv_7p1q",
      "name": "pr-42",
      "url": "https://pr-42-billing.acme.syner.app",
      "promotedDeploymentId": null
    }
  ],
  "createdBy": "prn_ana",
  "createdAt": "2026-09-04T18:20:00Z",
  "updatedAt": "2026-09-04T18:24:30Z"
}
```

**Authorization.** Authorization: the principal needs `apps:update` on the
app, checked through
[permissions/authorize](../../../lib/permissions/README.md).

**Errors.** `404` app not found, `403` not authorized, `409` name taken, `422`
invalid backend.

**Use case.** `update.ts` in [lib/apps](../../../lib/apps/README.md).

**From the SDK.**

```ts
await syner.apps.update({
  app: 'billing',
  backend: {
    runtime: 'node',
    entry: 'src/main.ts',
    env: ['STRIPE_KEY', 'SENTRY_DSN'],
  },
})
```

**Raw, from the CLI.** Flags follow `vercel api` and are a proposal: `-X`
selects the method (GET by default), `-F` adds a field, `--input` reads a body
from a file or `-` for stdin, `-H` adds a header.

```bash
syner api /apps/app_7c3a -X PATCH --input - <<'JSON'
{
  "backend": {
    "runtime": "node",
    "entry": "src/main.ts",
    "env": [
      "STRIPE_KEY",
      "SENTRY_DSN"
    ]
  }
}
JSON
```

### DELETE /apps/:id

Removing an app removes its environments, retires their deployments, and frees
the name for reuse. Its versions and its history stay readable, so the
organization can still answer what the app did while it existed.

Follow the operation in [operations](../../../lib/operations/README.md). When
it completes, the name is free and the app answers only to [get](README.md) as
removed.

**Request.** Path: `:id` becomes `id`. Headers: `Authorization: Bearer
<token>`. No body.

**Response.** `202 Accepted`. An operation reference; its result is the app
marked removed. The `Location` header will point to the operation once the
operations route is agreed.

```json
{
  "id": "op_4x1m",
  "organizationId": "org_3f9k",
  "kind": "apps/remove",
  "resource": {
    "kind": "app",
    "id": "app_7c3a"
  },
  "status": "pending",
  "progress": {
    "current": 0,
    "total": 3,
    "message": "retiring deployments"
  },
  "result": null,
  "error": null,
  "createdBy": "prn_ana",
  "createdAt": "2026-09-04T18:20:00Z",
  "finishedAt": null
}
```

**Authorization.** Authorization: the principal needs `apps:remove` on the
app, checked through
[permissions/authorize](../../../lib/permissions/README.md).

**Operation tracking.** Long-running. It returns an
[operation](../../../lib/operations/README.md) reference at once; the removed
app arrives through it.

**Errors.** `404` app not found, `403` not authorized, `409` removal in
progress.

**Use case.** `remove.ts` in [lib/apps](../../../lib/apps/README.md).

**From the SDK.**

```ts
const op = await syner.apps.remove({ app: 'billing' })
```

**Raw, from the CLI.** Flags follow `vercel api` and are a proposal: `-X`
selects the method (GET by default), `-F` adds a field, `--input` reads a body
from a file or `-` for stdin, `-H` adds a header.

```bash
syner api /apps/app_7c3a -X DELETE
```
