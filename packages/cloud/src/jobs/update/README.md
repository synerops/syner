<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">update</h1>

<p align="center">
  <strong>Change a job's action, triggers, or enabled flag.</strong>
</p>

Applies to future runs. Running runs finish under the old definition.

## From the SDK

```ts
await syner.jobs.update({
  id,
  enabled: false,
})
```

## From the CLI

```bash
syner jobs update close-month --disable
```

The same call through the raw API. The path is the node; the body is the
input.

```bash
syner api jobs/update '{"id": "job_6t8y", "enabled": false}'
```

## Response

```json
{
  "id": "job_6t8y",
  "organizationId": "org_3f9k",
  "appId": "app_7c3a",
  "name": "close-month",
  "action": {
    "kind": "app",
    "path": "/tasks/close-month"
  },
  "triggers": [
    {
      "kind": "schedule",
      "cron": "0 2 1 * *"
    },
    {
      "kind": "manual"
    }
  ],
  "enabled": false,
  "createdBy": "prn_ana",
  "createdAt": "2026-09-04T18:20:00Z",
  "updatedAt": "2026-09-04T18:24:30Z"
}
```
