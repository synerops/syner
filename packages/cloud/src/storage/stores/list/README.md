<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">list</h1>

<p align="center">
  <strong>List the stores of an organization.</strong>
</p>

Returns stores, newest first, in pages.

## From the SDK

```ts
const page = await syner.storage.stores.list({ organization: 'acme' })
```

## From the CLI

```bash
syner storage stores list
```

The same call through the raw API. The path is the node; the body is the
input.

```bash
syner api storage/stores/list '{"organization": "acme"}'
```

## Response

```json
{
  "items": [
    {
      "id": "sto_1a2b",
      "organizationId": "org_3f9k",
      "appId": "app_7c3a",
      "name": "invoices",
      "status": "ready",
      "createdBy": "prn_ana",
      "createdAt": "2026-09-04T18:20:00Z"
    }
  ],
  "next": null
}
```
