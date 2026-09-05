<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">/compute/environments</h1>

<p align="center">
  <strong>External contract of `/compute/environments`.</strong>
</p>

Route marked by `index.ts`, the provisional marker of the scaffold. Methods:
GET, POST. Path parameters: none.

## Below this route

- [`/compute/environments/:id`]([id]/README.md)

### GET /compute/environments

Returns environments, newest first, in pages.

**Request.** Headers: `Authorization: Bearer <token>`. Query: `organizationId`
required.; `status` optional filter.; `cursor, limit` paging. No body.

**Response.** `200 OK`. A page of environments.

```json
{
  "items": [
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
  ],
  "next": null
}
```

**Authorization.** Authorization: the principal needs `environments:read` on
the organization, checked through
[permissions/authorize](../../../lib/permissions/README.md).

**Errors.** `404` organization not found, `403` not authorized.

**Use case.** `list.ts` in
[lib/compute/environments](../../../lib/compute/environments/README.md).

**From the SDK.**

```ts
const page = await syner.compute.environments.list({ organization: 'acme' })
```

**Raw, from the CLI.** Flags follow `vercel api` and are a proposal: `-X`
selects the method (GET by default), `-F` adds a field, `--input` reads a body
from a file or `-` for stdin, `-H` adds a header.

```bash
syner api "/compute/environments?organizationId=org_3f9k"
```

### POST /compute/environments

Ask for a runtime and resources; the cloud provisions an isolated place for
them. Provisioning takes time, so you get an operation back.

When the operation completes, the environment is ready for
[executions/start](../executions/README.md).

**Request.** Headers: `Authorization: Bearer <token>`. Body:

- `organizationId`: the owner.
- `runtime`: a named runtime.
- `resources`: optional; defaults apply.
- `lifetime`: optional; `ephemeral` by default.

**Response.** `202 Accepted`. An operation reference; its result is the
environment, ready or failed. The `Location` header will point to the
operation once the operations route is agreed.

```json
{
  "id": "op_4x1m",
  "organizationId": "org_3f9k",
  "kind": "compute/environments/create",
  "resource": {
    "kind": "environment",
    "id": "env_8k2p"
  },
  "status": "pending",
  "progress": {
    "current": 0,
    "total": 3,
    "message": "allocating"
  },
  "result": null,
  "error": null,
  "createdBy": "prn_ana",
  "createdAt": "2026-09-04T18:20:00Z",
  "finishedAt": null
}
```

**Authorization.** Authorization: the principal needs `environments:create` on
the organization, checked through
[permissions/authorize](../../../lib/permissions/README.md). When the
principal is an agent acting under a delegation, the check applies to the
human's permissions, never to a wider set.

**Operation tracking.** Long-running. It returns an
[operation](../../../lib/operations/README.md) reference at once; the
environment arrives through it.

**Errors.** `404` organization not found, `403` not authorized, `422` unknown
runtime, `503` resources unavailable.

**Use case.** `create.ts` in
[lib/compute/environments](../../../lib/compute/environments/README.md).

**From the SDK.**

```ts
const op = await syner.compute.environments.create({
  organization: 'acme',
  runtime: 'node',
  resources: { cpu: 1, memory: '1GB' },
  lifetime: 'kept',
})
```

**Raw, from the CLI.** Flags follow `vercel api` and are a proposal: `-X`
selects the method (GET by default), `-F` adds a field, `--input` reads a body
from a file or `-` for stdin, `-H` adds a header.

```bash
syner api /compute/environments -X POST --input - <<'JSON'
{
  "organizationId": "org_3f9k",
  "runtime": "node",
  "resources": {
    "cpu": 1,
    "memory": "1GB"
  },
  "lifetime": "kept"
}
JSON
```
