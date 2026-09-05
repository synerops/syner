<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">list</h1>

<p align="center">
  <strong>List the versions of an app.</strong>
</p>

Returns the app's versions, newest first, in pages.

## Example

```ts
const page = await syner.apps.versions.list({ app: 'billing' })
```

In the CLI: `syner apps versions list billing`.

## What happens next

Follow `next` for older versions.
