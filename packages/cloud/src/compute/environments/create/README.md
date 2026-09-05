<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">create</h1>

<p align="center">
  <strong>Allocate an environment.</strong>
</p>

Ask for a runtime and resources; the cloud provisions an isolated place for
them. Provisioning takes time, so you get an operation back.

## Example

```ts
const op = await syner.compute.environments.create({
  organization: 'acme',
  runtime: 'node',
  resources: { cpu: 1, memory: '1GB' },
  lifetime: 'kept',
})
```

In the CLI: `syner compute environments create --runtime node`.

## What happens next

When the operation completes, the environment is ready for
[executions/start](../../executions/start/README.md).
