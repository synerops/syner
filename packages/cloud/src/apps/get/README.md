<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">get</h1>

<p align="center">
  <strong>Read one app.</strong>
</p>

Returns the app as the organization sees it: its definition and, when there is
one, the deployment serving traffic.

## Example

```ts
const app = await syner.apps.get({ organization: 'acme', name: 'billing' })
```

In the CLI: `syner apps get billing`.

## What happens next

To see its history use [versions/list](../versions/list/README.md) and
[deployments/list](../deployments/list/README.md).
