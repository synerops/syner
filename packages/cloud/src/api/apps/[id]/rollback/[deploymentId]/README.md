<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">/apps/:id/rollback/:deploymentId</h1>

<p align="center">
  <strong>Proposal for `/apps/:id/rollback/:deploymentId`.</strong>
</p>

Not agreed. This folder has no `index.ts`, so nothing is exposed here; it
documents a proposal. Mirrors Vercel, `POST
/v1/projects/{projectId}/rollback/{deploymentId}`: point production at a
previous deployment by id. A rollback in Syner creates a new deployment of the
target's version, so POST fits; the target travels in the path, as Vercel
does, and the CLI resolves the default (the previously live deployment) before
calling.

### POST /apps/:id/rollback/:deploymentId

A rollback deploys an earlier version, by default the one that was live before
the current deployment. It is a new deployment, so the history stays intact.
What the app wrote to its data since then is not undone.

**Request.** Path: `:id` becomes `appId`, `:deploymentId` becomes `to`.
Headers: `Authorization: Bearer <token>`. No body.

**Response.** `202 Accepted`. An operation reference; its result is the new
deployment and a note that data migrations are not reversed. The `Location`
header will point to the operation once the operations route is agreed.

```json
{
  "id": "op_4x1m",
  "organizationId": "org_3f9k",
  "kind": "apps/deployments/rollback",
  "resource": {
    "kind": "deployment",
    "id": "dep_8n3c"
  },
  "status": "pending",
  "progress": {
    "current": 0,
    "total": 3,
    "message": "deploying version 2"
  },
  "result": null,
  "error": null,
  "createdBy": "prn_ana",
  "createdAt": "2026-09-04T18:20:00Z",
  "finishedAt": null
}
```

**Authorization.** Authorization: the principal needs `deployments:rollback`
on the app, checked through
[permissions/authorize](../../../../../lib/permissions/README.md).

**Operation tracking.** Long-running. It returns an
[operation](../../../../../lib/operations/README.md) reference at once; the
new deployment arrives through it.

**Errors.** `404` app not found, `409` nothing to roll back to, `403` not
authorized, `409` deployment in progress.

**Use case.** `rollback.ts` in
[lib/apps/deployments](../../../../../lib/apps/deployments/README.md).

**From the SDK.**

```ts
const op = await syner.apps.deployments.rollback({ app: 'billing' })
```

**Raw, from the CLI.** Flags follow `vercel api` and are a proposal: `-X`
selects the method (GET by default), `-F` adds a field, `--input` reads a body
from a file or `-` for stdin, `-H` adds a header.

```bash
syner api /apps/app_7c3a/rollback/dep_8n3c -X POST
```
