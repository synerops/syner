<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">remove</h1>

<p align="center">
  <strong>Remove a store and everything in it.</strong>
</p>

Deletes the documents and files, then the store. Long-running.

## From the SDK

```ts
const op = await syner.storage.stores.remove({ id })
```

## From the CLI

```bash
syner storage stores remove invoices
```

The same call through the raw API. The path is the node; the body is the
input.

```bash
syner api storage/stores/remove '{"id": "sto_1a2b"}'
```

## Response

```json
{
  "id": "op_4x1m",
  "organizationId": "org_3f9k",
  "kind": "storage/stores/remove",
  "resource": {
    "kind": "store",
    "id": "sto_1a2b"
  },
  "status": "pending",
  "progress": {
    "current": 0,
    "total": 3,
    "message": "removing contents"
  },
  "result": null,
  "error": null,
  "createdBy": "prn_ana",
  "createdAt": "2026-09-04T18:20:00Z",
  "finishedAt": null
}
```
