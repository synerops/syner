<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">get</h1>

<p align="center">
  <strong>Read one version of an app.</strong>
</p>

Returns a version by number.

## Example

```ts
const v = await syner.apps.versions.get({ app: 'billing', number: 3 })
```

In the CLI: `syner apps versions get billing 3`.

## What happens next

To see where it ran, list [deployments](../../deployments/list/README.md).
