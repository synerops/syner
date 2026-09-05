<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">remove</h1>

<p align="center">
  <strong>Delete a document.</strong>
</p>

Removes the key. Optionally conditional on version.

## From the SDK

```ts
await syner.storage.documents.remove({
  store: 'invoices',
  key: '2026/03/inv-1042',
})
```

## From the CLI

```bash
syner storage documents remove invoices 2026/03/inv-1042
```

The same call through the raw API. The path is the node; the body is the
input.

```bash
syner api storage/documents/remove '{
  "store": "invoices",
  "key": "2026/03/inv-1042"
}'
```

## Response

```json
{
  "ok": true
}
```
