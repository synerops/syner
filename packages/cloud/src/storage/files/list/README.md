<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">list</h1>

<p align="center">
  <strong>List files by path prefix.</strong>
</p>

Walks the paths of a store, optionally under a prefix, in pages.

## Example

```ts
const page = await syner.storage.files.list({ store: 'invoices', prefix: 'pdf/' })
```

In the CLI: `syner storage files list invoices --prefix pdf/`.

## What happens next

Each item carries size and content type; bytes come from get.
