<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">/compute/executions/:id</h1>

<p align="center">
  <strong>External contract of `/compute/executions/:id`.</strong>
</p>

Route marked by `index.ts`, the provisional marker of the scaffold. Methods:
GET. Path parameters: `:id`.

## Below this route

- [`/compute/executions/:id/cancel`](cancel/README.md)

### GET /compute/executions/:id

Returns an execution with its status and, when finished, its result.

**Request.** Path: `:id` becomes `id`. Headers: `Authorization: Bearer
<token>`. No body.

**Response.** `200 OK`. The execution.

```json
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
```

**Authorization.** Authorization: the principal needs `executions:read` on the
execution, checked through
[permissions/authorize](../../../../lib/permissions/README.md).

**Errors.** `404` execution not found, `403` not authorized.

**Use case.** `get.ts` in
[lib/compute/executions](../../../../lib/compute/executions/README.md).

**From the SDK.**

```ts
const exec = await syner.compute.executions.get({ id })
```

**Raw, from the CLI.** Flags follow `vercel api` and are a proposal: `-X`
selects the method (GET by default), `-F` adds a field, `--input` reads a body
from a file or `-` for stdin, `-H` adds a header.

```bash
syner api /compute/executions/exe_c41d
```
