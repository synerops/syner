<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">get</h1>

<p align="center">
  <strong>Read a file.</strong>
</p>

Returns metadata and a read handle for the bytes.

## From the SDK

```ts
const file = await syner.storage.files.get({
  store: 'invoices',
  path: 'pdf/inv-1042.pdf',
})
```

## From the CLI

```bash
syner storage files get invoices pdf/inv-1042.pdf ./out.pdf
```

The same call through the raw API. The path is the node; the body is the
input.

```bash
syner api storage/files/get '{
  "store": "invoices",
  "path": "pdf/inv-1042.pdf"
}'
```

## Response

```json
{
  "storeId": "sto_1a2b",
  "path": "pdf/inv-1042.pdf",
  "contentType": "application/pdf",
  "size": 48213,
  "etag": "9f3c…",
  "updatedBy": "prn_bot",
  "updatedAt": "2026-09-04T18:24:30Z",
  "read": {
    "url": "https://files.syner.app/…",
    "expiresAt": "2026-09-04T18:35:00Z"
  }
}
```
