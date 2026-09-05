<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">/compute/environments/:id</h1>

<p align="center">
  <strong>External contract of `/compute/environments/:id`.</strong>
</p>

Route marked by `index.ts`, the provisional marker of the scaffold. Methods:
GET, DELETE. Path parameters: `:id`.

### GET /compute/environments/:id

Returns an environment and its status.

List what ran inside it with [executions/list](../../executions/README.md).

**Request.** Path: `:id` becomes `id`. Headers: `Authorization: Bearer
<token>`. No body.

**Response.** `200 OK`. The environment.

```json
{
  "id": "env_8k2p",
  "organizationId": "org_3f9k",
  "runtime": "node",
  "resources": {
    "cpu": 1,
    "memory": "1GB"
  },
  "status": "ready",
  "lifetime": "kept",
  "createdBy": "prn_bot",
  "createdAt": "2026-09-04T18:20:00Z",
  "stoppedAt": null
}
```

**Authorization.** Authorization: the principal needs `environments:read` on
the environment, checked through
[permissions/authorize](../../../../lib/permissions/README.md).

**Errors.** `404` environment not found, `403` not authorized.

**Use case.** `get.ts` in
[lib/compute/environments](../../../../lib/compute/environments/README.md).

**From the SDK.**

```ts
const env = await syner.compute.environments.get({ id })
```

**Raw, from the CLI.** Flags follow `vercel api` and are a proposal: `-X`
selects the method (GET by default), `-F` adds a field, `--input` reads a body
from a file or `-` for stdin, `-H` adds a header.

```bash
syner api /compute/environments/env_8k2p
```

### DELETE /compute/environments/:id

Stops what is running, releases the resources, and stops the meter. Running
executions end as cancelled.

**Request.** Path: `:id` becomes `id`. Headers: `Authorization: Bearer
<token>`. No body.

**Response.** `202 Accepted`. An operation reference; its result is the
stopped environment. The `Location` header will point to the operation once
the operations route is agreed.

```json
{
  "id": "op_4x1m",
  "organizationId": "org_3f9k",
  "kind": "compute/environments/remove",
  "resource": {
    "kind": "environment",
    "id": "env_8k2p"
  },
  "status": "pending",
  "progress": {
    "current": 0,
    "total": 3,
    "message": "stopping"
  },
  "result": null,
  "error": null,
  "createdBy": "prn_ana",
  "createdAt": "2026-09-04T18:20:00Z",
  "finishedAt": null
}
```

**Authorization.** Authorization: the principal needs `environments:remove` on
the environment, checked through
[permissions/authorize](../../../../lib/permissions/README.md).

**Operation tracking.** Long-running. It returns an
[operation](../../../../lib/operations/README.md) reference at once; the
stopped environment arrives through it.

**Errors.** `404` environment not found, `403` not authorized, `409` already
stopped.

**Use case.** `remove.ts` in
[lib/compute/environments](../../../../lib/compute/environments/README.md).

**From the SDK.**

```ts
const op = await syner.compute.environments.remove({ id })
```

**Raw, from the CLI.** Flags follow `vercel api` and are a proposal: `-X`
selects the method (GET by default), `-F` adds a field, `--input` reads a body
from a file or `-` for stdin, `-H` adds a header.

```bash
syner api /compute/environments/env_8k2p -X DELETE
```
