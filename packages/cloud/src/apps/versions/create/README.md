<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">create</h1>

<p align="center">
  <strong>Capture the app's code into a new version.</strong>
</p>

Point Syner at a git reference or upload a bundle. The version gets the next
number and freezes the app's current backend and frontend definition with it.

## Example

```ts
const version = await syner.apps.versions.create({
  app: 'billing',
  source: { kind: 'git', ref: 'main' },
})
```

In the CLI: `syner apps versions create billing --ref main`.

## What happens next

Deploy it with [deployments/create](../../deployments/create/README.md).
