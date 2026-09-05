<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">create</h1>

<p align="center">
  <strong>Define a job and what starts it.</strong>
</p>

Name the job, say what a run does, and list its triggers. Nothing runs until a
trigger fires or someone starts a run.

Start one by hand with [runs/start](../runs/start/README.md) to try it.

## From the SDK

```ts
const job = await syner.jobs.create({
  organization: 'acme',
  app: 'billing',
  name: 'close-month',
  action: {
    kind: 'app',
    path: '/tasks/close-month',
  },
  triggers: [
    { kind: 'schedule', cron: '0 2 1 * *' },
    { kind: 'manual' },
  ],
})
```

## From the CLI

```bash
syner jobs create close-month --app billing --cron '0 2 1 * *'
```

The same call through the raw API. The path is the node; the body is the
input.

```bash
syner api jobs/create '{
  "organization": "acme",
  "app": "billing",
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
  ]
}'
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
  "enabled": true,
  "createdBy": "prn_ana",
  "createdAt": "2026-09-04T18:20:00Z",
  "updatedAt": "2026-09-04T18:20:00Z"
}
```
