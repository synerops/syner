<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">get</h1>

<p align="center">
  <strong>Read one run.</strong>
</p>

Returns the run with its events and reference.

## From the SDK

```ts
const run = await syner.jobs.runs.get({ id })
```

## From the CLI

```bash
syner jobs runs get <id>
```

The same call through the raw API. The path is the node; the body is the
input.

```bash
syner api jobs/runs/get '{"id": "run_3h9j"}'
```

## Response

```json
{
  "id": "run_3h9j",
  "jobId": "job_6t8y",
  "startedBy": {
    "principal": "prn_ana"
  },
  "status": "succeeded",
  "events": [
    {
      "at": "2026-09-04T18:24:30Z",
      "kind": "started",
      "message": "calling /tasks/close-month"
    },
    {
      "at": "2026-09-04T18:24:30Z",
      "kind": "finished",
      "message": "200 OK"
    }
  ],
  "reference": {
    "appCall": {
      "path": "/tasks/close-month",
      "statusCode": 200
    }
  },
  "createdAt": "2026-09-04T18:24:30Z",
  "finishedAt": "2026-09-04T18:24:30Z"
}
```
