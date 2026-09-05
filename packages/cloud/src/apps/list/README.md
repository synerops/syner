<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">list</h1>

<p align="center">
  <strong>List the apps of an organization.</strong>
</p>

Returns the organization's apps, newest first, in pages.

## Example

```ts
const page = await syner.apps.list({ organization: 'acme' })
```

In the CLI: `syner apps list`.

## What happens next

Each item is the same shape [get](../get/README.md) returns. Follow `next` to
read the following page.
