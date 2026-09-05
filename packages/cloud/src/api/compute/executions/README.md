<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">/compute/executions</h1>

<p align="center">
  <strong>External contract of `/compute/executions`.</strong>
</p>

Route marked by `index.ts`, the provisional marker of the scaffold. Methods:
GET, POST. Path parameters: none.

## Below this route

- [`/compute/executions/:id`]([id]/README.md)

### GET /compute/executions

Returns executions of an environment or an organization, newest first, in
pages.

**Request.** Headers: `Authorization: Bearer <token>`. Query: `environmentId
or organizationId` one is required.; `status` optional filter.; `cursor,
limit` paging. No body.

**Response.** `200 OK`. A page of executions.

```json
{
  "items": [
    {
      "id": "exe_c41d",
      "environmentId": "env_8k2p",
      "command": [
        "bun",
        "test"
      ],
      "input": null,
      "status": "succeeded",
      "result": {
        "exitCode": 0,
        "output": "out_c41d",
        "artifacts": [
          "sto_1a2b:reports/junit.xml"
        ]
      },
      "createdBy": "prn_bot",
      "createdAt": "2026-09-04T18:20:00Z",
      "finishedAt": "2026-09-04T18:24:30Z"
    }
  ],
  "next": null
}
```

**Authorization.** Authorization: the principal needs `executions:read` on the
environment or the organization, checked through
[permissions/authorize](../../../lib/permissions/README.md).

**Errors.** `404` environment not found, `404` organization not found, `403`
not authorized.

**Use case.** `list.ts` in
[lib/compute/executions](../../../lib/compute/executions/README.md).

**From the SDK.**

```ts
const page = await syner.compute.executions.list({ environment: envId })
```

**Raw, from the CLI.** Flags follow `vercel api` and are a proposal: `-X`
selects the method (GET by default), `-F` adds a field, `--input` reads a body
from a file or `-` for stdin, `-H` adds a header.

```bash
syner api "/compute/executions?environmentId=aenv_5r8t"
```

### POST /compute/executions

Give a command and, if you have one, an environment. Without one, the cloud
allocates an ephemeral environment for this execution alone. You get the
execution back at once with status queued or running; read it again to see it
finish.

Poll [get]([id]/README.md) until the status is final, or
[cancel]([id]/cancel/README.md) it.

**Request.** Headers: `Authorization: Bearer <token>`. Body:

- `environmentId`: optional; when absent an ephemeral environment is
  allocated.
- `command`: required.
- `input`: optional.
- `runtime, resources`: used only when allocating implicitly.

**Response.** `201 Created`. The execution with status `queued` or `running`.

```json
{
  "id": "exe_c41d",
  "environmentId": "env_8k2p",
  "command": [
    "bun",
    "test"
  ],
  "input": null,
  "status": "running",
  "result": null,
  "createdBy": "prn_bot",
  "createdAt": "2026-09-04T18:20:00Z",
  "finishedAt": null
}
```

**Authorization.** Authorization: the principal needs `executions:start` on
the environment, or the organization when allocating, checked through
[permissions/authorize](../../../lib/permissions/README.md). When the
principal is an agent acting under a delegation, the check applies to the
human's permissions, never to a wider set.

**Operation tracking.** Returns the execution itself, which carries its own
status; no operation is created.

**Errors.** `404` environment not found, `409` environment stopped, `403` not
authorized, `422` unknown runtime.

**Use case.** `start.ts` in
[lib/compute/executions](../../../lib/compute/executions/README.md).

**From the SDK.**

```ts
const exec = await syner.compute.executions.start({
  environment: envId,
  command: ['bun', 'test'],
})
```

**Raw, from the CLI.** Flags follow `vercel api` and are a proposal: `-X`
selects the method (GET by default), `-F` adds a field, `--input` reads a body
from a file or `-` for stdin, `-H` adds a header.

```bash
syner api /compute/executions -X POST --input - <<'JSON'
{
  "environmentId": "aenv_5r8t",
  "command": [
    "bun",
    "test"
  ]
}
JSON
```
