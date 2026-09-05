<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">/apps</h1>

<p align="center">
  <strong>External contract of `/apps`.</strong>
</p>

Route marked by `index.ts`, the provisional marker of the scaffold. Methods:
GET, POST. Path parameters: none.

## Below this route

- [`/apps/:id`]([id]/README.md)

## CLI experience (agreed)

```text
syner apps          Apps running in the selected context
syner apps --all    Every app, with its status
```

The intent stands. How a list summarizes an app with several environments,
which environment `syner apps` reads to say running, and how a person selects
another one are pending. No environment is a default. Until decided, `GET
/apps` returns every app with its `environments` summary and no `running`
filter.

### GET /apps

Returns the organization's apps, newest first, in pages.

Each item is the same shape [get]([id]/README.md) returns. Follow `next` to
read the following page.

**Request.** Headers: `Authorization: Bearer <token>`. Query: `organizationId`
required; taken from the shared context when the request carries one.;
`cursor, limit` paging; limit defaults to the cloud's page size. No body.

**Response.** `200 OK`. A page: `items[]` and `next`. Each item is the app
with its `environments` summary. How a list summarizes several environments
for `syner apps` is pending.

```json
{
  "items": [
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
  ],
  "next": null
}
```

**Authorization.** Authorization: the principal needs `apps:read` on the
organization, checked through
[permissions/authorize](../../lib/permissions/README.md).

**Errors.** `404` organization not found, `403` not authorized.

**Use case.** `list.ts` in [lib/apps](../../lib/apps/README.md).

**From the SDK.**

```ts
const page = await syner.apps.list({ organization: 'acme' })
```

**Raw, from the CLI.** Flags follow `vercel api` and are a proposal: `-X`
selects the method (GET by default), `-F` adds a field, `--input` reads a body
from a file or `-` for stdin, `-H` adds a header.

```bash
syner api "/apps?organizationId=org_3f9k"
```

### POST /apps

This is the first verb of the cloud. It gives the app an identity: a name
inside your organization and a definition of its backend. Nothing runs yet.
The app becomes reachable when a version is created and deployed.

You get the app back with no deployment. Next:
[versions/create]([id]/versions/README.md) to capture its code, then
[deployments/create]([id]/deployments/README.md) to put it into service.

**Request.** Headers: `Authorization: Bearer <token>`. Body:

- `organizationId`: the owner.
- `name`: unique within the organization.
- `backend`: `runtime`, `entry`, `env[]`.
- `frontend`: optional.
- `purpose`: optional; the app's purpose as described in purpose/.

**Response.** `201 Created`. The app as stored, with no environment yet.

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
  "environments": [],
  "createdBy": "prn_ana",
  "createdAt": "2026-09-04T18:20:00Z",
  "updatedAt": "2026-09-04T18:20:00Z"
}
```

**Authorization.** Authorization: the principal needs `apps:create` on the
organization, checked through
[permissions/authorize](../../lib/permissions/README.md). When the principal
is an agent acting under a delegation, the check applies to the human's
permissions, never to a wider set.

**Errors.** `404` organization not found, `403` not authorized, `409` name
taken, `422` invalid backend.

**Use case.** `create.ts` in [lib/apps](../../lib/apps/README.md).

**From the SDK.**

```ts
const app = await syner.apps.create({
  organization: 'acme',
  name: 'billing',
  backend: {
    runtime: 'node',
    entry: 'src/server.ts',
    env: ['STRIPE_KEY'],
  },
})
```

**Raw, from the CLI.** Flags follow `vercel api` and are a proposal: `-X`
selects the method (GET by default), `-F` adds a field, `--input` reads a body
from a file or `-` for stdin, `-H` adds a header.

```bash
syner api /apps -X POST --input - <<'JSON'
{
  "organizationId": "org_3f9k",
  "name": "billing",
  "backend": {
    "runtime": "node",
    "entry": "src/server.ts",
    "env": [
      "STRIPE_KEY"
    ]
  }
}
JSON
```
