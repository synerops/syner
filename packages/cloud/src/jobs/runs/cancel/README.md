<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">cancel</h1>

<p align="center">
  <strong>Stop a run.</strong>
</p>

Stops a queued or running run and whatever it started.

## From the SDK

```ts
await syner.jobs.runs.cancel({ id })
```

## From the CLI

```bash
syner jobs runs cancel <id>
```

The same call through the raw API. The path is the node; the body is the
input.

```bash
syner api jobs/runs/cancel '{"id": "run_3h9j"}'
```

## Response

```json
{
  "id": "run_3h9j",
  "jobId": "job_6t8y",
  "startedBy": {
    "principal": "prn_ana"
  },
  "status": "cancelled",
  "events": [
    {
      "at": "2026-09-04T18:24:30Z",
      "kind": "started",
      "message": "calling /tasks/close-month"
    },
    {
      "at": "2026-09-04T18:24:30Z",
      "kind": "finished",
      "message": "cancelled by prn_ana"
    }
  ],
  "reference": {
    "appCall": {
      "path": "/tasks/close-month",
      "statusCode": null
    }
  },
  "createdAt": "2026-09-04T18:24:30Z",
  "finishedAt": "2026-09-04T18:24:30Z"
}
```
