<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">get</h1>

<p align="center">
  <strong>Read one operation.</strong>
</p>

Returns the operation with its status, progress, and, when finished, its
result or error.

## From the SDK

```ts
const op = await syner.ops.get({ id })

if (op.status === 'succeeded') {
  console.log(op.result)
}
```

## From the CLI

```bash
syner ops get <id>
```

The same call through the raw API. The path is the node; the body is the
input.

```bash
syner api ops/get '{"id": "op_4x1m"}'
```

## Response

```json
{
  "id": "op_4x1m",
  "organizationId": "org_3f9k",
  "kind": "apps/deployments/create",
  "resource": {
    "kind": "deployment",
    "id": "dep_2b7q"
  },
  "status": "succeeded",
  "progress": {
    "current": 3,
    "total": 3,
    "message": "live"
  },
  "result": {
    "deploymentId": "dep_2b7q",
    "url": "https://billing.acme.syner.app"
  },
  "error": null,
  "createdBy": "prn_ana",
  "createdAt": "2026-09-04T18:20:00Z",
  "finishedAt": "2026-09-04T18:24:30Z"
}
```
