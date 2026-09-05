<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">get</h1>

<p align="center">
  <strong>Read one deployment.</strong>
</p>

Returns a deployment with its status, URL, and the operation behind it.

## Example

```ts
const d = await syner.apps.deployments.get({ app: 'billing', id: deploymentId })
```

In the CLI: `syner apps deployments get billing <id>`.

## What happens next

While pending, the operation carries the progress.
