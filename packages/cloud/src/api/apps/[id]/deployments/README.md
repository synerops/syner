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

Returns the app's deployments, newest first, in pages. Filter by environment
to see one context.

**Request.** Path: `:id` becomes `appId`. Headers: `Authorization: Bearer
<token>`. Query: `environmentId` optional filter.; `process, availability`
optional filters.; `cursor, limit` paging. No body.

**Response.** `200 OK`. A page of deployments.

```json
{
  "items": [
    {
      "id": "dep_2b7q",
      "appId": "app_7c3a",
      "environmentId": "aenv_5r8t",
      "versionId": "ver_9b21",
      "process": "ready",
      "availability": "available",
      "promoted": true,
      "url": "https://dep-2b7q-billing.acme.syner.app",
      "target": {
        "kind": "provider",
        "ref": "prv_east1"
      },
      "configCapturedAt": "2026-09-04T18:20:00Z",
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
const page = await syner.apps.deployments.list({ app: 'billing', environment: envId })
```

**Raw, from the CLI.** Flags follow `vercel api` and are a proposal: `-X`
selects the method (GET by default), `-F` adds a field, `--input` reads a body
from a file or `-` for stdin, `-H` adds a header.

```bash
syner api "/apps/app_7c3a/deployments?environmentId=aenv_5r8t"
```

### POST /apps/:id/deployments

Deploying runs a version inside an environment: build, provision, and bring
the deployment to ready at its own address. You get an operation back
immediately. When it completes, the deployment is available. It answers at the
environment's stable domain only after you promote it.

Follow the operation in [operations](../../../../lib/operations/README.md).
Then
[promote](../environments/[environmentId]/promote/[deploymentId]/README.md) it
to the environment's domain.

**Request.** Path: `:id` becomes `appId`. Headers: `Authorization: Bearer
<token>`. Body:

- `environmentId`: required.
- `versionId or number`: the version.
- `target`: optional; the cloud's default target when omitted.

**Response.** `202 Accepted`. An operation reference; its result is the
deployment, ready and available, or failed. The `Location` header will point
to the operation once the operations route is agreed.

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
the environment, checked through
[permissions/authorize](../../../../lib/permissions/README.md).

**Operation tracking.** Long-running. It returns an
[operation](../../../../lib/operations/README.md) reference at once; the
deployment arrives through it.

**Errors.** `404` app not found, `404` environment not found, `404` version
not found, `403` not authorized, `503` target unavailable.

**Use case.** `create.ts` in
[lib/apps/deployments](../../../../lib/apps/deployments/README.md).

**From the SDK.**

```ts
const op = await syner.apps.deployments.create({
  app: 'billing',
  environment: envId,
  version: 3,
})

const deployment = await op.result()
```

**Raw, from the CLI.** Flags follow `vercel api` and are a proposal: `-X`
selects the method (GET by default), `-F` adds a field, `--input` reads a body
from a file or `-` for stdin, `-H` adds a header.

```bash
syner api /apps/app_7c3a/deployments -X POST \
  -F environmentId=aenv_5r8t \
  -F versionId=ver_9b21
```

## Pending on this route

- One collection for the app; `environmentId` is required on `POST` and a
  filter on `GET`. Nesting deployments under environments would duplicate
  these operations.
