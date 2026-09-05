<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">/connections/:id/credentials</h1>

<p align="center">
  <strong>External contract of `/connections/:id/credentials`.</strong>
</p>

Route marked by `index.ts`, the provisional marker of the scaffold. Methods:
PUT. Path parameters: `:id`.

### PUT /connections/:id/credentials

Send the secret once. The cloud keeps it in the vault and the connection
records that it is set.

**Request.** Path: `:id` becomes `connectionId`. Headers: `Authorization:
Bearer <token>`. Body:

- `material`: the secret; shape defined by the service.

**Response.** `200 OK`. The credential status: `setAt` and `fingerprint`.

```json
{
  "connectionId": "con_5e7r",
  "setBy": "prn_ana",
  "setAt": "2026-09-04T18:24:30Z",
  "fingerprint": "sha256:1c9e…"
}
```

**Authorization.** Authorization: the principal needs `credentials:set` on the
connection, checked through
[permissions/authorize](../../../../lib/permissions/README.md). When the
principal is an agent acting under a delegation, the check applies to the
human's permissions, never to a wider set.

**Errors.** `404` connection not found, `403` not authorized, `422` invalid
material.

**Use case.** `set.ts` in
[lib/connections/credentials](../../../../lib/connections/credentials/README.md).

**From the SDK.**

```ts
await syner.connections.credentials.set({
  connection: id,
  material: process.env.STRIPE_KEY,
})
```

**Raw, from the CLI.** Flags follow `vercel api` and are a proposal: `-X`
selects the method (GET by default), `-F` adds a field, `--input` reads a body
from a file or `-` for stdin, `-H` adds a header.

```bash
syner api /connections/con_5e7r/credentials -X PUT --input -
```

The material comes from stdin and never from an inline argument.

## Pending on this route

- The credential is write-only; this route never returns material.
