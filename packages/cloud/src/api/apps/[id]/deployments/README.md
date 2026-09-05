<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">/apps/:id/deployments</h1>

<p align="center">
  <strong>External contract of `/apps/:id/deployments`.</strong>
</p>

Route marked by `index.ts`, the provisional marker of the scaffold. Methods:
GET, POST. Path parameters: `:id`.

## Below this route

- [`/apps/:id/deployments/:deploymentId`]([deploymentId]/README.md)

### GET /apps/:id/deployments

Returns the app's deployments, newest first, in pages.

**Request.** Path: `:id` becomes `appId`. Headers: `Authorization: Bearer
<token>`. Query: `status` optional filter.; `cursor, limit` paging. No body.

**Response.** `200 OK`. A page of deployments.

```json
{
  "items": [
    {
      "id": "dep_2b7q",
      "appId": "app_7c3a",
      "versionId": "ver_9b21",
      "status": "live",
      "url": "https://billing.acme.syner.app",
      "target": {
        "kind": "provider",
        "ref": "prv_east1"
      },
      "operationId": "op_4x1m",
      "createdBy": "prn_ana",
      "createdAt": "2026-09-04T18:20:00Z",
      "finishedAt": "2026-09-04T18:24:30Z"
    }
  ],
  "next": null
}
```

**Authorization.** Authorization: the principal needs `deployments:read` on
the app, checked through
[permissions/authorize](../../../../lib/permissions/README.md).

**Errors.** `404` app not found, `403` not authorized.

**Use case.** `list.ts` in
[lib/apps/deployments](../../../../lib/apps/deployments/README.md).

**From the SDK.**

```ts
const page = await syner.apps.deployments.list({ app: 'billing' })
```

**Raw, from the CLI.** Flags follow `vercel api` and are a proposal: `-X`
selects the method (GET by default), `-F` adds a field, `--input` reads a body
from a file or `-` for stdin, `-H` adds a header.

```bash
syner api /apps/app_7c3a/deployments
```

### POST /apps/:id/deployments

Deploying starts the work of building, provisioning, and switching traffic.
You get an operation back immediately; when it completes, the deployment is
live and it is the app's current one.

Follow the operation in [operations](../../../../lib/operations/README.md).
Once live, [apps/get](../README.md) shows it as the current deployment.

**Request.** Path: `:id` becomes `appId`. Headers: `Authorization: Bearer
<token>`. Body:

- `versionId or number`: the version.
- `target`: optional; the cloud's default target when omitted.

**Response.** `202 Accepted`. An operation reference; its result is the
deployment, live or failed. The `Location` header will point to the operation
once the operations route is agreed.

```json
{
  "id": "op_4x1m",
  "organizationId": "org_3f9k",
  "kind": "apps/deployments/create",
  "resource": {
    "kind": "deployment",
    "id": "dep_2b7q"
  },
  "status": "pending",
  "progress": {
    "current": 0,
    "total": 3,
    "message": "building version 3"
  },
  "result": null,
  "error": null,
  "createdBy": "prn_ana",
  "createdAt": "2026-09-04T18:20:00Z",
  "finishedAt": null
}
```

**Authorization.** Authorization: the principal needs `deployments:create` on
the app, checked through
[permissions/authorize](../../../../lib/permissions/README.md).

**Operation tracking.** Long-running. It returns an
[operation](../../../../lib/operations/README.md) reference at once; the
deployment arrives through it.

**Errors.** `404` app not found, `404` version not found, `403` not
authorized, `409` deployment in progress, `503` target unavailable.

**Use case.** `create.ts` in
[lib/apps/deployments](../../../../lib/apps/deployments/README.md).

**From the SDK.**

```ts
const op = await syner.apps.deployments.create({
  app: 'billing',
  version: 3,
})

const deployment = await op.result()
```

**Raw, from the CLI.** Flags follow `vercel api` and are a proposal: `-X`
selects the method (GET by default), `-F` adds a field, `--input` reads a body
from a file or `-` for stdin, `-H` adds a header.

```bash
syner api /apps/app_7c3a/deployments -X POST -F versionId=ver_9b21
```
