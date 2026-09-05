<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">/apps/:id/environments/:environmentId/promote/:deploymentId</h1>

<p align="center">
  <strong>External contract of `/apps/:id/environments/:environmentId/promote/:deploymentId`.</strong>
</p>

Route marked by `index.ts`, the provisional marker of the scaffold. Methods:
POST. Path parameters: `:id`, `:environmentId`, `:deploymentId`.

### POST /apps/:id/environments/:environmentId/promote/:deploymentId

Promotion is what makes a deployment answer at the environment's stable
domain, the intent Vercel expresses as `POST
/v10/projects/{projectId}/promote/{deploymentId}`. Creating a deployment does
not promote it; promoting one does not destroy the previous, which stays
available. Rollback is this same act on an earlier deployment: nothing is
rebuilt. Switching a domain takes time, so promotion is requested and then
confirmed.

**Request.** Path: `:id` becomes `appId`, `:environmentId` becomes `id`,
`:deploymentId` becomes `deploymentId`. Headers: `Authorization: Bearer
<token>`. No body.

**Response.** `202 Accepted`. An operation reference. `202` means the
promotion is requested, not that traffic has changed; the operation's result
is the environment with `promotedDeploymentId` set once the domain answers
with the new deployment. The `Location` header will point to the operation
once the operations route is agreed.

```json
{
  "id": "op_4x1m",
  "organizationId": "org_3f9k",
  "kind": "apps/environments/promote",
  "resource": {
    "kind": "environment",
    "id": "aenv_5r8t"
  },
  "status": "pending",
  "progress": {
    "current": 0,
    "total": 3,
    "message": "switching billing.acme.syner.app to dep_2b7q"
  },
  "result": null,
  "error": null,
  "createdBy": "prn_ana",
  "createdAt": "2026-09-04T18:20:00Z",
  "finishedAt": null
}
```

**Authorization.** Authorization: the principal needs `environments:promote`
on the environment, checked through
[permissions/authorize](../../../../../../../lib/permissions/README.md).

**Operation tracking.** Long-running. It returns an
[operation](../../../../../../../lib/operations/README.md) reference at once;
the environment with the new promotion arrives through it.

**Errors.** `404` app not found, `404` environment not found, `404` deployment
not found, `422` deployment not available, `403` not authorized, `409`
promotion in progress.

**Use case.** `promote.ts` in
[lib/apps/environments](../../../../../../../lib/apps/environments/README.md).

**From the SDK.**

```ts
const op = await syner.apps.environments.promote({
  app: 'billing',
  id: envId,
  deployment: 'dep_2b7q',
})

const env = await op.result()
```

**Raw, from the CLI.** Flags follow `vercel api` and are a proposal: `-X`
selects the method (GET by default), `-F` adds a field, `--input` reads a body
from a file or `-` for stdin, `-H` adds a header.

```bash
syner api /apps/app_7c3a/environments/aenv_5r8t/promote/dep_2b7q -X POST
```

## Pending on this route

- `POST` because promotion starts work: the domain switch is long-running and
  answers `202` with an operation. Rollback is this call with an earlier
  deployment; Vercel's `POST /v1/projects/{projectId}/rollback/{deploymentId}`
  is the equivalent intent.
