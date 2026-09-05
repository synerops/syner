<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">evaluate</h1>

<p align="center">
  <strong>Check whether an app is fulfilling its purpose.</strong>
</p>

Evaluate reads the app's activity and usage over a window and measures each
criterion against it. The result is met, partial, or unmet, with the evidence
per criterion. It runs on demand from Syner OS or Syner Bot, or on a schedule
as a job.

The evaluation is appended to the purpose; [get](../get/README.md) returns it
as the latest. An unmet result is what Syner OS shows in red.

## From the SDK

```ts
const op = await syner.purpose.evaluate({
  app: 'billing',
  window: {
    since: '2026-03-01',
    until: '2026-04-01',
  },
})

const evaluation = await op.result()
```

## From the CLI

```bash
syner purpose evaluate billing --since 2026-03-01
```

The same call through the raw API. The path is the node; the body is the
input.

```bash
syner api purpose/evaluate '{
  "app": "billing",
  "window": {
    "since": "2026-03-01",
    "until": "2026-04-01"
  }
}'
```

## Response

```json
{
  "id": "op_4x1m",
  "organizationId": "org_3f9k",
  "kind": "purpose/evaluate",
  "resource": {
    "kind": "purpose",
    "id": "app_7c3a"
  },
  "status": "pending",
  "progress": {
    "current": 0,
    "total": 3,
    "message": "reading activity"
  },
  "result": null,
  "error": null,
  "createdBy": "prn_ana",
  "createdAt": "2026-09-04T18:20:00Z",
  "finishedAt": null
}
```
