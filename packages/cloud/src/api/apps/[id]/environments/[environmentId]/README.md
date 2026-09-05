<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">/apps/:id/environments/:environmentId</h1>

<p align="center">
  <strong>External contract of `/apps/:id/environments/:environmentId`.</strong>
</p>

Route marked by `index.ts`, the provisional marker of the scaffold. Methods:
GET, PATCH, DELETE. Path parameters: `:id`, `:environmentId`.

### GET /apps/:id/environments/:environmentId

Returns the environment with its configuration references, resources, access,
domain, and promoted deployment.

List what has been deployed here with
[deployments/list](../../deployments/README.md) filtered by environment.

**Request.** Path: `:id` becomes `appId`, `:environmentId` becomes `id`.
Headers: `Authorization: Bearer <token>`. No body.

**Response.** `200 OK`. The environment. Secret values are never returned,
only their references.

```json
{
  "id": "aenv_5r8t",
  "appId": "app_7c3a",
  "name": "production",
  "lifetime": "persistent",
  "config": {
    "values": {
      "LOG_LEVEL": "info"
    },
    "secrets": {
      "STRIPE_KEY": "sec_2k9d"
    }
  },
  "resources": {
    "connectionIds": [
      "con_5e7r"
    ],
    "storeIds": [
      "sto_1a2b"
    ]
  },
  "access": {
    "deploy": [
      "role:admin"
    ],
    "promote": [
      "role:owner"
    ]
  },
  "domain": "billing.acme.syner.app",
  "promotedDeploymentId": "dep_2b7q",
  "origin": {
    "kind": "manual",
    "ref": null
  },
  "status": "active",
  "createdBy": "prn_ana",
  "createdAt": "2026-09-04T18:20:00Z",
  "updatedAt": "2026-09-04T18:24:30Z"
}
```

**Authorization.** Authorization: the principal needs `environments:read` on
the environment, checked through
[permissions/authorize](../../../../../lib/permissions/README.md).

**Errors.** `404` app not found, `404` environment not found, `403` not
authorized.

**Use case.** `get.ts` in
[lib/apps/environments](../../../../../lib/apps/environments/README.md).

**From the SDK.**

```ts
const env = await syner.apps.environments.get({ app: 'billing', id: envId })
```

**Raw, from the CLI.** Flags follow `vercel api` and are a proposal: `-X`
selects the method (GET by default), `-F` adds a field, `--input` reads a body
from a file or `-` for stdin, `-H` adds a header.

```bash
syner api /apps/app_7c3a/environments/aenv_5r8t
```

### PATCH /apps/:id/environments/:environmentId

Changes apply to the environment's definition. Whether a running deployment
sees a configuration change at once, or only the next deployment does, is
pending; until then, a change here promises nothing about what is already
running.

**Request.** Path: `:id` becomes `appId`, `:environmentId` becomes `id`.
Headers: `Authorization: Bearer <token>`. Body:

- `name, lifetime, config, resources, access, origin`: any subset;
  `config.values` and `config.secrets` are replaced whole.

**Response.** `200 OK`. The environment after the change.

```json
{
  "id": "aenv_5r8t",
  "appId": "app_7c3a",
  "name": "production",
  "lifetime": "persistent",
  "config": {
    "values": {
      "LOG_LEVEL": "info"
    },
    "secrets": {
      "STRIPE_KEY": "sec_2k9d"
    }
  },
  "resources": {
    "connectionIds": [
      "con_5e7r"
    ],
    "storeIds": [
      "sto_1a2b"
    ]
  },
  "access": {
    "deploy": [
      "role:admin"
    ],
    "promote": [
      "role:owner"
    ]
  },
  "domain": "billing.acme.syner.app",
  "promotedDeploymentId": "dep_2b7q",
  "origin": {
    "kind": "manual",
    "ref": null
  },
  "status": "active",
  "createdBy": "prn_ana",
  "createdAt": "2026-09-04T18:20:00Z",
  "updatedAt": "2026-09-04T18:24:30Z"
}
```

**Authorization.** Authorization: the principal needs `environments:update` on
the environment, checked through
[permissions/authorize](../../../../../lib/permissions/README.md).

**Errors.** `404` app not found, `404` environment not found, `403` not
authorized, `409` name taken, `422` invalid config.

**Use case.** `update.ts` in
[lib/apps/environments](../../../../../lib/apps/environments/README.md).

**From the SDK.**

```ts
await syner.apps.environments.update({
  app: 'billing',
  id: envId,
  config: {
    values: { LOG_LEVEL: 'info' },
  },
})
```

**Raw, from the CLI.** Flags follow `vercel api` and are a proposal: `-X`
selects the method (GET by default), `-F` adds a field, `--input` reads a body
from a file or `-` for stdin, `-H` adds a header.

```bash
syner api /apps/app_7c3a/environments/aenv_5r8t -X PATCH --input - <<'JSON'
{
  "config": {
    "values": {
      "LOG_LEVEL": "info"
    }
  }
}
JSON
```

### DELETE /apps/:id/environments/:environmentId

Retires its deployments, releases its stable domain, and removes the
definition. What happens to the stores, secrets, and connections it referenced
is not promised: nothing is cleaned or deleted without an explicit contract.

**Request.** Path: `:id` becomes `appId`, `:environmentId` becomes `id`.
Headers: `Authorization: Bearer <token>`. No body.

**Response.** `202 Accepted`. An operation reference; its result is the
removed environment. The `Location` header will point to the operation once
the operations route is agreed.

```json
{
  "id": "op_4x1m",
  "organizationId": "org_3f9k",
  "kind": "apps/environments/remove",
  "resource": {
    "kind": "environment",
    "id": "aenv_7p1q"
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

**Authorization.** Authorization: the principal needs `environments:remove` on
the environment, checked through
[permissions/authorize](../../../../../lib/permissions/README.md).

**Operation tracking.** Long-running. It returns an
[operation](../../../../../lib/operations/README.md) reference at once; the
removed environment arrives through it.

**Errors.** `404` app not found, `404` environment not found, `403` not
authorized, `409` removal in progress.

**Use case.** `remove.ts` in
[lib/apps/environments](../../../../../lib/apps/environments/README.md).

**From the SDK.**

```ts
const op = await syner.apps.environments.remove({ app: 'billing', id: envId })
```

**Raw, from the CLI.** Flags follow `vercel api` and are a proposal: `-X`
selects the method (GET by default), `-F` adds a field, `--input` reads a body
from a file or `-` for stdin, `-H` adds a header.

```bash
syner api /apps/app_7c3a/environments/aenv_5r8t -X DELETE
```

## Pending on this route

- Promotion has its own route so that pointing the domain at a deployment is
  never mistaken for editing the definition.
