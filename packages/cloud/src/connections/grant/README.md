<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">grant</h1>

<p align="center">
  <strong>Let an app or a principal use a connection.</strong>
</p>

A grant is the only way to use a connection. It names an app or a principal;
the holder never sees the credential.

## Example

```ts
await syner.connections.grant({ id, app: 'billing' })
```

In the CLI: `syner connections grant stripe --app billing`.

## What happens next

The app's backend can now call the service through the cloud.
