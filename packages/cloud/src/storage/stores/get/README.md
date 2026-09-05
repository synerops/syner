<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">get</h1>

<p align="center">
  <strong>Read one store.</strong>
</p>

Returns a store by id, or by organization and name.

List its contents with [documents/list](../../documents/list/README.md) or
[files/list](../../files/list/README.md).

## From the SDK

```ts
const store = await syner.storage.stores.get({
  organization: 'acme',
  name: 'invoices',
})
```

## From the CLI

```bash
syner storage stores get invoices
```

The same call through the raw API. The path is the node; the body is the
input.

```bash
syner api storage/stores/get '{"organization": "acme", "name": "invoices"}'
```

## Response

```json
{
  "id": "sto_1a2b",
  "organizationId": "org_3f9k",
  "appId": "app_7c3a",
  "name": "invoices",
  "status": "ready",
  "createdBy": "prn_ana",
  "createdAt": "2026-09-04T18:20:00Z"
}
```
