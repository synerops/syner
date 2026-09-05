<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">get</h1>

<p align="center">
  <strong>Read one principal.</strong>
</p>

Returns a principal by id.

## From the SDK

```ts
const p = await syner.identity.principals.get({ id })
```

## From the CLI

```bash
syner identity principals get <id>
```

The same call through the raw API. The path is the node; the body is the
input.

```bash
syner api identity/principals/get '{"id": "prn_ana"}'
```

## Response

```json
{
  "id": "prn_ana",
  "kind": "human",
  "name": "Ana",
  "subject": "auth|ana@acme.com",
  "status": "active",
  "firstSeenAt": "2026-09-04T18:20:00Z",
  "lastSeenAt": "2026-09-04T18:24:30Z"
}
```
