<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">put</h1>

<p align="center">
  <strong>Create or replace a document.</strong>
</p>

Writes a JSON body under a key. Same key, new version.

Read it back with [get](../get/README.md).

## From the SDK

```ts
await syner.storage.documents.put({
  store: 'invoices',
  key: '2026/03/inv-1042',
  body: { total: 120 },
})
```

## From the CLI

```bash
syner storage documents put invoices 2026/03/inv-1042 --body @inv.json
```

The same call through the raw API. The path is the node; the body is the
input.

```bash
syner api storage/documents/put '{
  "store": "invoices",
  "key": "2026/03/inv-1042",
  "body": {
    "total": 120
  }
}'
```

## Response

```json
{
  "key": "2026/03/inv-1042",
  "version": 4
}
```
