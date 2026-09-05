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

## Example

```ts
const exec = await syner.compute.executions.start({
  environment: envId,
  command: ['bun', 'test'],
})
```

In the CLI: `syner compute executions start --environment <id> -- bun test`.

## What happens next

Poll [get](../get/README.md) until the status is final, or
[cancel](../cancel/README.md) it.
