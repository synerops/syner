<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">start</h1>

<p align="center">
  <strong>Start a run now.</strong>
</p>

Runs the job's action once, outside its schedule.

Read it with [get](../get/README.md) until the status is final.

## From the SDK

```ts
const run = await syner.jobs.runs.start({ job: id })
```

## From the CLI

```bash
syner jobs runs start close-month
```

The same call through the raw API. The path is the node; the body is the
input.

```bash
syner api jobs/runs/start '{"job": "job_6t8y"}'
```

## Response

```json
{
  "id": "run_3h9j",
  "jobId": "job_6t8y",
  "startedBy": {
    "principal": "prn_ana"
  },
  "status": "running",
  "events": [
    {
      "at": "2026-09-04T18:24:30Z",
      "kind": "started",
      "message": "calling /tasks/close-month"
    }
  ],
  "reference": {
    "appCall": {
      "path": "/tasks/close-month",
      "statusCode": null
    }
  },
  "createdAt": "2026-09-04T18:24:30Z",
  "finishedAt": null
}
```
