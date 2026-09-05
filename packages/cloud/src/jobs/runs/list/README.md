<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">list</h1>

<p align="center">
  <strong>List the runs of a job.</strong>
</p>

Returns runs, newest first, in pages.

## From the SDK

```ts
const page = await syner.jobs.runs.list({
  job: id,
  status: 'failed',
})
```

## From the CLI

```bash
syner jobs runs list close-month --status failed
```

The same call through the raw API. The path is the node; the body is the
input.

```bash
syner api jobs/runs/list '{"job": "job_6t8y", "status": "failed"}'
```

## Response

```json
{
  "items": [
    {
      "id": "run_3h9j",
      "jobId": "job_6t8y",
      "startedBy": {
        "principal": "prn_ana"
      },
      "status": "failed",
      "events": [
        {
          "at": "2026-09-04T18:24:30Z",
          "kind": "started",
          "message": "calling /tasks/close-month"
        },
        {
          "at": "2026-09-04T18:24:30Z",
          "kind": "error",
          "message": "502 Bad Gateway"
        }
      ],
      "reference": {
        "appCall": {
          "path": "/tasks/close-month",
          "statusCode": 502
        }
      },
      "createdAt": "2026-09-04T18:24:30Z",
      "finishedAt": "2026-09-04T18:24:30Z"
    }
  ],
  "next": null
}
```
