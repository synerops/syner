<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">/apps/:id/environments</h1>

<p align="center">
  <strong>External contract of `/apps/:id/environments`.</strong>
</p>

Route marked by `index.ts`, the provisional marker of the scaffold. Methods:
GET, POST. Path parameters: `:id`.

## Below this route

- [`/apps/:id/environments/:environmentId`]([environmentId]/README.md)

### GET /apps/:id/environments

Returns the app's environments with the deployment each has promoted.

**Request.** Path: `:id` becomes `appId`. Headers: `Authorization: Bearer
<token>`. Query: `lifetime` optional filter.; `cursor, limit` paging. No body.

**Response.** `200 OK`. A page of environments.

```json
{
  "items": [
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
  ],
  "next": null
}
```

**Authorization.** Authorization: the principal needs `environments:read` on
the app, checked through
[permissions/authorize](../../../../lib/permissions/README.md).

**Errors.** `404` app not found, `403` not authorized.

**Use case.** `list.ts` in
[lib/apps/environments](../../../../lib/apps/environments/README.md).

**From the SDK.**

```ts
const page = await syner.apps.environments.list({ app: 'billing' })
```

**Raw, from the CLI.** Flags follow `vercel api` and are a proposal: `-X`
selects the method (GET by default), `-F` adds a field, `--input` reads a body
from a file or `-` for stdin, `-H` adds a header.

```bash
syner api /apps/app_7c3a/environments
```

### POST /apps/:id/environments

Give it a name, a lifetime, and the configuration the backend expects. Nothing
runs yet: the environment gets a stable domain that answers nothing until a
deployment is created in it and promoted.

Deploy a version into it with [deployments/create](../deployments/README.md),
then [promote]([environmentId]/promote/[deploymentId]/README.md) it to the
domain.

**Request.** Path: `:id` becomes `appId`. Headers: `Authorization: Bearer
<token>`. Body:

- `name`: unique within the app.
- `lifetime`: `persistent`, or `temporary` with optional `expiresAt`.
- `config`: optional: values and secret references.
- `resources`: optional: connection and store ids.
- `access`: optional: deploy and promote bindings; defaults to the app's
  roles.
- `origin`: optional.

**Response.** `201 Created`. The environment, with `promotedDeploymentId`
empty and its stable domain assigned.

```json
{
  "id": "aenv_5r8t",
  "appId": "app_7c3a",
  "name": "pr-42",
  "lifetime": {
    "kind": "temporary",
    "expiresAt": "2026-09-12T00:00:00Z"
  },
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
  "domain": "pr-42-billing.acme.syner.app",
  "promotedDeploymentId": null,
  "origin": {
    "kind": "pull-request",
    "ref": "42"
  },
  "status": "active",
  "createdBy": "prn_ana",
  "createdAt": "2026-09-04T18:24:30Z",
  "updatedAt": "2026-09-04T18:24:30Z"
}
```

**Authorization.** Authorization: the principal needs `environments:create` on
the app, checked through
[permissions/authorize](../../../../lib/permissions/README.md).

**Errors.** `404` app not found, `403` not authorized, `409` name taken, `422`
invalid config, `404` connection not found, `404` store not found.

**Use case.** `create.ts` in
[lib/apps/environments](../../../../lib/apps/environments/README.md).

**From the SDK.**

```ts
const env = await syner.apps.environments.create({
  app: 'billing',
  name: 'pr-42',
  lifetime: { kind: 'temporary', expiresAt: '2026-09-12T00:00:00Z' },
  config: {
    values: { LOG_LEVEL: 'debug' },
    secrets: { STRIPE_KEY: 'sec_2k9d' },
  },
  origin: { kind: 'pull-request', ref: '42' },
})
```

**Raw, from the CLI.** Flags follow `vercel api` and are a proposal: `-X`
selects the method (GET by default), `-F` adds a field, `--input` reads a body
from a file or `-` for stdin, `-H` adds a header.

```bash
syner api /apps/app_7c3a/environments -X POST --input - <<'JSON'
{
  "name": "pr-42",
  "lifetime": {
    "kind": "temporary",
    "expiresAt": "2026-09-12T00:00:00Z"
  },
  "config": {
    "values": {
      "LOG_LEVEL": "debug"
    },
    "secrets": {
      "STRIPE_KEY": "sec_2k9d"
    }
  },
  "origin": {
    "kind": "pull-request",
    "ref": "42"
  }
}
JSON
```
