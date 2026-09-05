<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">start</h1>

<p align="center">
  <strong>Run a command in an environment.</strong>
</p>

Give a command and, if you have one, an environment. Without one, the cloud
allocates an ephemeral environment for this execution alone. You get the
execution back at once with status queued or running; read it again to see it
finish.

Poll [get](../get/README.md) until the status is final, or
[cancel](../cancel/README.md) it.

## From the SDK

```ts
const exec = await syner.compute.executions.start({
  environment: envId,
  command: ['bun', 'test'],
})
```

## From the CLI

```bash
syner compute executions start --environment <id> -- bun test
```

The same call through the raw API. The path is the node; the body is the
input.

```bash
syner api compute/executions/start '{
  "environment": "env_8k2p",
  "command": [
    "bun",
    "test"
  ]
}'
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
  "status": "running",
  "result": null,
  "createdBy": "prn_bot",
  "createdAt": "2026-09-04T18:20:00Z",
  "finishedAt": null
}
```
