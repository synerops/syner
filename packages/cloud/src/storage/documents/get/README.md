<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">get</h1>

<p align="center">
  <strong>Read a document.</strong>
</p>

Returns the body and version under a key.

## Example

```ts
const doc = await syner.storage.documents.get({ store: 'invoices', key: '2026/03/inv-1042' })
```

In the CLI: `syner storage documents get invoices 2026/03/inv-1042`.

## What happens next

Keep the version if you plan a conditional put.
