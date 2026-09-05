<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">/connections/:id/grants/:granteeId</h1>

<p align="center">
  <strong>External contract of `/connections/:id/grants/:granteeId`.</strong>
</p>

Route marked by `index.ts`, the provisional marker of the scaffold. Methods:
DELETE. Path parameters: `:id`, `:granteeId`.

### DELETE /connections/:id/grants/:granteeId

Removes one grant. The holder's next call through the connection fails.

**Request.** Path: `:id` becomes `id`, `:granteeId` becomes `appId or
principalId`. Headers: `Authorization: Bearer <token>`. No body.

**Response.** `204 No Content`.

**Authorization.** Authorization: the principal needs `connections:revoke` on
the connection, checked through
[permissions/authorize](../../../../../lib/permissions/README.md).

**Errors.** `404` connection not found, `403` not authorized.

**Use case.** `revoke.ts` in
[lib/connections](../../../../../lib/connections/README.md).

**From the SDK.**

```ts
await syner.connections.revoke({
  id,
  app: 'billing',
})
```

**Raw, from the CLI.** Flags follow `vercel api` and are a proposal: `-X`
selects the method (GET by default), `-F` adds a field, `--input` reads a body
from a file or `-` for stdin, `-H` adds a header.

```bash
syner api /connections/con_5e7r/grants/app_7c3a -X DELETE
```
