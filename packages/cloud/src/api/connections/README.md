<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">/connections</h1>

<p align="center">
  <strong>External contract of `/connections`.</strong>
</p>

Route marked by `index.ts`, the provisional marker of the scaffold. Methods:
GET, POST. Path parameters: none.

## Below this route

- [`/connections/:id`]([id]/README.md)

### GET /connections

Returns connections, newest first, in pages.

**Request.** Headers: `Authorization: Bearer <token>`. Query: `organizationId`
required.; `service` optional filter.; `cursor, limit` paging. No body.

**Response.** `200 OK`. A page of connections.

```json
{
  "items": [
    {
      "id": "con_5e7r",
      "organizationId": "org_3f9k",
      "name": "stripe",
      "service": "stripe",
      "config": {
        "account": "acct_123"
      },
      "credentialSetAt": "2026-09-04T18:24:30Z",
      "grants": [
        {
          "appId": "app_7c3a",
          "grantedBy": "prn_ana",
          "at": "2026-09-04T18:24:30Z"
        }
      ],
      "createdBy": "prn_ana",
      "createdAt": "2026-09-04T18:20:00Z"
    }
  ],
  "next": null
}
```

**Authorization.** Authorization: the principal needs `connections:read` on
the organization, checked through
[permissions/authorize](../../lib/permissions/README.md).

**Errors.** `404` organization not found, `403` not authorized.

**Use case.** `list.ts` in [lib/connections](../../lib/connections/README.md).

**From the SDK.**

```ts
const page = await syner.connections.list({ organization: 'acme' })
```

**Raw, from the CLI.** Flags follow `vercel api` and are a proposal: `-X`
selects the method (GET by default), `-F` adds a field, `--input` reads a body
from a file or `-` for stdin, `-H` adds a header.

```bash
syner api "/connections?organizationId=org_3f9k"
```

### POST /connections

Name the service and give the non-secret settings. The credential comes
separately, through [credentials/set]([id]/credentials/README.md), so the
secret never travels with the configuration.

**Request.** Headers: `Authorization: Bearer <token>`. Body:

- `organizationId`: the owner.
- `name`: unique in the organization.
- `service`: a named kind.
- `config`: non-secret settings.

**Response.** `201 Created`. The connection with `credentialSetAt` empty and
no grants.

```json
{
  "id": "con_5e7r",
  "organizationId": "org_3f9k",
  "name": "stripe",
  "service": "stripe",
  "config": {
    "account": "acct_123"
  },
  "credentialSetAt": null,
  "grants": [],
  "createdBy": "prn_ana",
  "createdAt": "2026-09-04T18:20:00Z"
}
```

**Authorization.** Authorization: the principal needs `connections:create` on
the organization, checked through
[permissions/authorize](../../lib/permissions/README.md). When the principal
is an agent acting under a delegation, the check applies to the human's
permissions, never to a wider set.

**Errors.** `404` organization not found, `403` not authorized, `409` name
taken, `422` unknown service, `422` secret in config.

**Use case.** `create.ts` in
[lib/connections](../../lib/connections/README.md).

**From the SDK.**

```ts
const connection = await syner.connections.create({
  organization: 'acme',
  name: 'stripe',
  service: 'stripe',
  config: {
    account: 'acct_123',
  },
})
```

**Raw, from the CLI.** Flags follow `vercel api` and are a proposal: `-X`
selects the method (GET by default), `-F` adds a field, `--input` reads a body
from a file or `-` for stdin, `-H` adds a header.

```bash
syner api /connections -X POST --input - <<'JSON'
{
  "organizationId": "org_3f9k",
  "name": "stripe",
  "service": "stripe",
  "config": {
    "account": "acct_123"
  }
}
JSON
```
