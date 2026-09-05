<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">remove</h1>

<p align="center">
  <strong>Take an app out of service and release its name.</strong>
</p>

Removing an app tears down whatever is serving it and frees the name for
reuse. Its versions and its history stay readable, so the organization can
still answer what the app did while it existed.

## Example

```ts
const op = await syner.apps.remove({ app: 'billing' })
```

In the CLI: `syner apps remove billing`.

## What happens next

Follow the operation in [ops](../../ops/README.md). When it completes, the
name is free and the app answers only to [get](../get/README.md) as removed.
