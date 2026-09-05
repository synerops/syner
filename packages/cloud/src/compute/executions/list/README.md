<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">list</h1>

<p align="center">
  <strong>List executions.</strong>
</p>

Returns executions of an environment or an organization, newest first, in
pages.

## From the SDK

```ts
const page = await syner.compute.executions.list({ environment: envId })
```

## From the CLI

```bash
syner compute executions list --environment <id>
```

The same call through the raw API. The path is the node; the body is the
input.

```bash
syner api compute/executions/list '{"environment": "env_8k2p"}'
```

## Response

```json
{
  "items": [
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
  ],
  "next": null
}
```
