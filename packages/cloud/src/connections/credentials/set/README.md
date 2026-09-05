<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">set</h1>

<p align="center">
  <strong>Store or rotate a connection's secret.</strong>
</p>

Send the secret once. The cloud keeps it in the vault and the connection
records that it is set.

## From the SDK

```ts
await syner.connections.credentials.set({
  connection: id,
  material: process.env.STRIPE_KEY,
})
```

## From the CLI

```bash
syner connections credentials set stripe
```

## Response

```json
{
  "connectionId": "con_5e7r",
  "setBy": "prn_ana",
  "setAt": "2026-09-04T18:24:30Z",
  "fingerprint": "sha256:1c9e…"
}
```
