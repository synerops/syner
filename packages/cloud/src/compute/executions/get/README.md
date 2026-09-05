<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">get</h1>

<p align="center">
  <strong>Read one execution.</strong>
</p>

Returns an execution with its status and, when finished, its result.

## From the SDK

```ts
const exec = await syner.compute.executions.get({ id })
```

## From the CLI

```bash
syner compute executions get <id>
```

The same call through the raw API. The path is the node; the body is the
input.

```bash
syner api compute/executions/get '{"id": "exe_c41d"}'
```

## Response

```json
{
  "id": "exe_c41d",
  "environmentId": "env_8k2p",
  "command": [
    "bun",
    "test"
  ],
  "input": null,
  "status": "succeeded",
  "result": {
    "exitCode": 0,
    "output": "out_c41d",
    "artifacts": [
      "sto_1a2b:reports/junit.xml"
    ]
  },
  "createdBy": "prn_bot",
  "createdAt": "2026-09-04T18:20:00Z",
  "finishedAt": "2026-09-04T18:24:30Z"
}
```
