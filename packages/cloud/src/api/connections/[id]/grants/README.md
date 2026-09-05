<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">/connections/:id/grants</h1>

<p align="center">
  <strong>External contract of `/connections/:id/grants`.</strong>
</p>

Route marked by `index.ts`, the provisional marker of the scaffold. Methods:
POST. Path parameters: `:id`.

## Below this route

- [`/connections/:id/grants/:granteeId`]([granteeId]/README.md)

### POST /connections/:id/grants

A grant is the only way to use a connection. It names an app or a principal;
the holder never sees the credential.

**Request.** Path: `:id` becomes `id`. Headers: `Authorization: Bearer
<token>`. Body:

- `appId or principalId`: exactly one.

**Response.** `201 Created`. The connection with its grants.

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

**Authorization.** Authorization: the principal needs `connections:grant` on
the connection, checked through
[permissions/authorize](../../../../lib/permissions/README.md).

**Errors.** `404` connection not found, `404` app not found, `404` principal
not found, `403` not authorized.

**Use case.** `grant.ts` in
[lib/connections](../../../../lib/connections/README.md).

**From the SDK.**

```ts
await syner.connections.grant({
  id,
  app: 'billing',
})
```

**Raw, from the CLI.** Flags follow `vercel api` and are a proposal: `-X`
selects the method (GET by default), `-F` adds a field, `--input` reads a body
from a file or `-` for stdin, `-H` adds a header.

```bash
syner api /connections/con_5e7r/grants -X POST -F appId=app_7c3a
```
