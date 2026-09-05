<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">list</h1>

<p align="center">
  <strong>List documents by key prefix.</strong>
</p>

Walks the keys of a store, optionally under a prefix, in pages.

## Example

```ts
const page = await syner.storage.documents.list({ store: 'invoices', prefix: '2026/03/' })
```

In the CLI: `syner storage documents list invoices --prefix 2026/03/`.

## What happens next

Ask for bodies with `includeBodies` when the page is small enough.
