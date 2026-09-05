<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">/apps/:id/deployments/:deploymentId</h1>

<p align="center">
  <strong>External contract of `/apps/:id/deployments/:deploymentId`.</strong>
</p>

Route marked by `index.ts`, the provisional marker of the scaffold. Methods:
GET. Path parameters: `:id`, `:deploymentId`.

### GET /apps/:id/deployments/:deploymentId

Returns a deployment with its process, availability, address, whether it is
promoted, and the operation behind it.

**Request.** Path: `:id` becomes `appId`, `:deploymentId` becomes `id`.
Headers: `Authorization: Bearer <token>`. No body.

**Response.** `200 OK`. The deployment.

```json
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
```

**Authorization.** Authorization: the principal needs `deployments:read` on
the app, checked through
[permissions/authorize](../../../../../lib/permissions/README.md).

**Errors.** `404` app not found, `404` deployment not found, `403` not
authorized.

**Use case.** `get.ts` in
[lib/apps/deployments](../../../../../lib/apps/deployments/README.md).

**From the SDK.**

```ts
const deployment = await syner.apps.deployments.get({
  app: 'billing',
  id: deploymentId,
})
```

**Raw, from the CLI.** Flags follow `vercel api` and are a proposal: `-X`
selects the method (GET by default), `-F` adds a field, `--input` reads a body
from a file or `-` for stdin, `-H` adds a header.

```bash
syner api /apps/app_7c3a/deployments/dep_2b7q
```
