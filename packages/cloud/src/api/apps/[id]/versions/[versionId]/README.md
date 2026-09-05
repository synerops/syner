<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">/apps/:id/versions/:versionId</h1>

<p align="center">
  <strong>External contract of `/apps/:id/versions/:versionId`.</strong>
</p>

Route marked by `index.ts`, the provisional marker of the scaffold. Methods:
GET. Path parameters: `:id`, `:versionId`.

### GET /apps/:id/versions/:versionId

Returns a version by number.

To see where it ran, list [deployments](../../deployments/README.md).

**Request.** Path: `:id` becomes `appId`, `:versionId` becomes `id`. Headers:
`Authorization: Bearer <token>`. Query: `number` the version number, or `id`.
No body.

**Response.** `200 OK`. The version.

```json
{
  "id": "ver_9b21",
  "appId": "app_7c3a",
  "number": 3,
  "source": {
    "kind": "git",
    "ref": "main",
    "commit": "4e1f0c9",
    "artifactId": "art_5d8e"
  },
  "backend": {
    "runtime": "node",
    "entry": "src/server.ts",
    "env": [
      "STRIPE_KEY"
    ]
  },
  "frontend": null,
  "createdBy": "prn_ana",
  "createdAt": "2026-09-04T18:20:00Z"
}
```

**Authorization.** Authorization: the principal needs `versions:read` on the
app, checked through
[permissions/authorize](../../../../../lib/permissions/README.md).

**Errors.** `404` app not found, `404` version not found, `403` not
authorized.

**Use case.** `get.ts` in
[lib/apps/versions](../../../../../lib/apps/versions/README.md).

**From the SDK.**

```ts
const version = await syner.apps.versions.get({
  app: 'billing',
  number: 3,
})
```

**Raw, from the CLI.** Flags follow `vercel api` and are a proposal: `-X`
selects the method (GET by default), `-F` adds a field, `--input` reads a body
from a file or `-` for stdin, `-H` adds a header.

```bash
syner api /apps/app_7c3a/versions/ver_9b21
```
