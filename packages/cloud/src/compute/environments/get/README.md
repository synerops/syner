<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">get</h1>

<p align="center">
  <strong>Read one environment.</strong>
</p>

Returns an environment and its status.

List what ran inside it with
[executions/list](../../executions/list/README.md).

## From the SDK

```ts
const env = await syner.compute.environments.get({ id })
```

## From the CLI

```bash
syner compute environments get <id>
```

The same call through the raw API. The path is the node; the body is the
input.

```bash
syner api compute/environments/get '{"id": "env_8k2p"}'
```

## Response

```json
{
  "id": "env_8k2p",
  "organizationId": "org_3f9k",
  "runtime": "node",
  "resources": {
    "cpu": 1,
    "memory": "1GB"
  },
  "status": "ready",
  "lifetime": "kept",
  "createdBy": "prn_bot",
  "createdAt": "2026-09-04T18:20:00Z",
  "stoppedAt": null
}
```
