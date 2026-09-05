<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">list</h1>

<p align="center">
  <strong>List the environments of an organization.</strong>
</p>

Returns environments, newest first, in pages.

## From the SDK

```ts
const page = await syner.compute.environments.list({ organization: 'acme' })
```

## From the CLI

```bash
syner compute environments list
```

The same call through the raw API. The path is the node; the body is the
input.

```bash
syner api compute/environments/list '{"organization": "acme"}'
```

## Response

```json
{
  "items": [
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
  ],
  "next": null
}
```
