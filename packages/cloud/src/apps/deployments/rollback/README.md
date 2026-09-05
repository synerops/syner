<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">rollback</h1>

<p align="center">
  <strong>Serve a previous version again.</strong>
</p>

A rollback deploys an earlier version, by default the one that was live before
the current deployment. It is a new deployment, so the history stays intact.
What the app wrote to its data since then is not undone.

## Example

```ts
const op = await syner.apps.deployments.rollback({ app: 'billing' })
```

In the CLI: `syner apps deployments rollback billing`, or add `--version 2`.

## What happens next

Follow the operation. Its result names the version now live and reminds you
that data migrations were not reversed.
