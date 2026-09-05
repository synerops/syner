<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">remove</h1>

<p align="center">
  <strong>Stop and release an environment.</strong>
</p>

Stops what is running, releases the resources, and stops the meter. Running
executions end as cancelled.

## From the SDK

```ts
const op = await syner.compute.environments.remove({ id })
```

## From the CLI

```bash
syner compute environments remove <id>
```

The same call through the raw API. The path is the node; the body is the
input.

```bash
syner api compute/environments/remove '{"id": "env_8k2p"}'
```

## Response

```json
{
  "id": "op_4x1m",
  "organizationId": "org_3f9k",
  "kind": "compute/environments/remove",
  "resource": {
    "kind": "environment",
    "id": "env_8k2p"
  },
  "status": "pending",
  "progress": {
    "current": 0,
    "total": 3,
    "message": "stopping"
  },
  "result": null,
  "error": null,
  "createdBy": "prn_ana",
  "createdAt": "2026-09-04T18:20:00Z",
  "finishedAt": null
}
```
