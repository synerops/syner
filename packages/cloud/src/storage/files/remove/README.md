<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">remove</h1>

<p align="center">
  <strong>Delete a file.</strong>
</p>

Removes the path from the store.

## From the SDK

```ts
await syner.storage.files.remove({
  store: 'invoices',
  path: 'pdf/inv-1042.pdf',
})
```

## From the CLI

```bash
syner storage files remove invoices pdf/inv-1042.pdf
```

The same call through the raw API. The path is the node; the body is the
input.

```bash
syner api storage/files/remove '{
  "store": "invoices",
  "path": "pdf/inv-1042.pdf"
}'
```

## Response

```json
{
  "ok": true
}
```
