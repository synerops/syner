<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">rollback</h1>

<p align="center">
  <strong>Serve a previous version again.</strong>
</p>

A rollback deploys an earlier version, by default the one that was live before
the current deployment. It is a new deployment, so the history stays intact.
What the app wrote to its data since then is not undone.

## From the SDK

```ts
const op = await syner.apps.deployments.rollback({ app: 'billing' })
```

## From the CLI

```bash
syner apps deployments rollback billing
```

The same call through the raw API. The path is the node; the body is the
input.

```bash
syner api apps/deployments/rollback '{"app": "billing"}'
```

## Response

```json
{
  "id": "op_4x1m",
  "organizationId": "org_3f9k",
  "kind": "apps/deployments/rollback",
  "resource": {
    "kind": "deployment",
    "id": "dep_8n3c"
  },
  "status": "pending",
  "progress": {
    "current": 0,
    "total": 3,
    "message": "deploying version 2"
  },
  "result": null,
  "error": null,
  "createdBy": "prn_ana",
  "createdAt": "2026-09-04T18:20:00Z",
  "finishedAt": null
}
```
