<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">/apps/:id/versions</h1>

<p align="center">
  <strong>External contract of `/apps/:id/versions`.</strong>
</p>

Route marked by `index.ts`, the provisional marker of the scaffold. Methods:
GET, POST. Path parameters: `:id`.

## Below this route

- [`/apps/:id/versions/:versionId`]([versionId]/README.md)

### GET /apps/:id/versions

Returns the app's versions, newest first, in pages.

**Request.** Path: `:id` becomes `appId`. Headers: `Authorization: Bearer
<token>`. Query: `cursor, limit` paging. No body.

**Response.** `200 OK`. A page of versions.

```json
{
  "items": [
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
  ],
  "next": null
}
```

**Authorization.** Authorization: the principal needs `versions:read` on the
app, checked through
[permissions/authorize](../../../../lib/permissions/README.md).

**Errors.** `404` app not found, `403` not authorized.

**Use case.** `list.ts` in
[lib/apps/versions](../../../../lib/apps/versions/README.md).

**From the SDK.**

```ts
const page = await syner.apps.versions.list({ app: 'billing' })
```

**Raw, from the CLI.** Flags follow `vercel api` and are a proposal: `-X`
selects the method (GET by default), `-F` adds a field, `--input` reads a body
from a file or `-` for stdin, `-H` adds a header.

```bash
syner api /apps/app_7c3a/versions
```

### POST /apps/:id/versions

Point Syner at a git reference or upload a bundle. The version gets the next
number and freezes the app's current backend and frontend definition with it.

Deploy it with [deployments/create](../deployments/README.md).

**Request.** Path: `:id` becomes `appId`. Headers: `Authorization: Bearer
<token>`. Body:

- `source`: `kind` and `ref`, or an upload handle.

**Response.** `201 Created`. The version with its number and the captured
definition.

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

**Authorization.** Authorization: the principal needs `versions:create` on the
app, checked through
[permissions/authorize](../../../../lib/permissions/README.md).

**Errors.** `404` app not found, `403` not authorized, `422` invalid source,
`503` source unreachable.

**Use case.** `create.ts` in
[lib/apps/versions](../../../../lib/apps/versions/README.md).

**From the SDK.**

```ts
const version = await syner.apps.versions.create({
  app: 'billing',
  source: { kind: 'git', ref: 'main' },
})
```

**Raw, from the CLI.** Flags follow `vercel api` and are a proposal: `-X`
selects the method (GET by default), `-F` adds a field, `--input` reads a body
from a file or `-` for stdin, `-H` adds a header.

```bash
syner api /apps/app_7c3a/versions -X POST --input - <<'JSON'
{
  "source": {
    "kind": "git",
    "ref": "main"
  }
}
JSON
```
