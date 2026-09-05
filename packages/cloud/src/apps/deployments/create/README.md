<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">create</h1>

<p align="center">
  <strong>Put a version into service.</strong>
</p>

Deploying starts the work of building, provisioning, and switching traffic.
You get an operation back immediately; when it completes, the deployment is
live and it is the app's current one.

Follow the operation in [ops](../../../ops/README.md). Once live,
[apps/get](../../get/README.md) shows it as the current deployment.

## From the SDK

```ts
const op = await syner.apps.deployments.create({
  app: 'billing',
  version: 3,
})

const deployment = await op.result()
```

## From the CLI

```bash
syner apps deployments create billing --version 3
```

The same call through the raw API. The path is the node; the body is the
input.

```bash
syner api apps/deployments/create '{"app": "billing", "version": 3}'
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
  "status": "pending",
  "progress": {
    "current": 0,
    "total": 3,
    "message": "building version 3"
  },
  "result": null,
  "error": null,
  "createdBy": "prn_ana",
  "createdAt": "2026-09-04T18:20:00Z",
  "finishedAt": null
}
```
