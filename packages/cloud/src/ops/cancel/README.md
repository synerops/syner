<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">cancel</h1>

<p align="center">
  <strong>Ask an operation to stop.</strong>
</p>

Cancellation is a request: the operation stops at its next safe point and
reports cancelled.

## From the SDK

```ts
await syner.ops.cancel({ id })
```

## From the CLI

```bash
syner ops cancel <id>
```

The same call through the raw API. The path is the node; the body is the
input.

```bash
syner api ops/cancel '{"id": "op_4x1m"}'
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
  "status": "cancelled",
  "progress": {
    "current": 2,
    "total": 3,
    "message": "stopped before switching traffic"
  },
  "result": null,
  "error": null,
  "createdBy": "prn_ana",
  "createdAt": "2026-09-04T18:20:00Z",
  "finishedAt": "2026-09-04T18:24:30Z"
}
```
