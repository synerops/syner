<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">/connections/:id</h1>

<p align="center">
  <strong>External contract of `/connections/:id`.</strong>
</p>

Route marked by `index.ts`, the provisional marker of the scaffold. Methods:
GET, DELETE. Path parameters: `:id`.

## Below this route

- [`/connections/:id/credentials`](credentials/README.md)
- [`/connections/:id/grants`](grants/README.md)

### GET /connections/:id

Returns the connection: config, credential status, grants. Never the secret.

**Request.** Path: `:id` becomes `id`. Headers: `Authorization: Bearer
<token>`. No body.

**Response.** `200 OK`. The connection.

```json
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
```

**Authorization.** Authorization: the principal needs `connections:read` on
the connection, checked through
[permissions/authorize](../../../lib/permissions/README.md).

**Errors.** `404` connection not found, `403` not authorized.

**Use case.** `get.ts` in
[lib/connections](../../../lib/connections/README.md).

**From the SDK.**

```ts
const connection = await syner.connections.get({
  organization: 'acme',
  name: 'stripe',
})
```

**Raw, from the CLI.** Flags follow `vercel api` and are a proposal: `-X`
selects the method (GET by default), `-F` adds a field, `--input` reads a body
from a file or `-` for stdin, `-H` adds a header.

```bash
syner api /connections/con_5e7r
```

### DELETE /connections/:id

Revokes every grant, destroys the credential, and removes the connection.

**Request.** Path: `:id` becomes `id`. Headers: `Authorization: Bearer
<token>`. No body.

**Response.** `204 No Content`.

**Authorization.** Authorization: the principal needs `connections:remove` on
the connection, checked through
[permissions/authorize](../../../lib/permissions/README.md).

**Errors.** `404` connection not found, `403` not authorized.

**Use case.** `remove.ts` in
[lib/connections](../../../lib/connections/README.md).

**From the SDK.**

```ts
await syner.connections.remove({ id })
```

**Raw, from the CLI.** Flags follow `vercel api` and are a proposal: `-X`
selects the method (GET by default), `-F` adds a field, `--input` reads a body
from a file or `-` for stdin, `-H` adds a header.

```bash
syner api /connections/con_5e7r -X DELETE
```
