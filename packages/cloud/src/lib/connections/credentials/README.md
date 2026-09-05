<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">credentials</h1>

<p align="center">
  <strong>The secret behind a connection, written once and never read back.</strong>
</p>

A credential is the API key, token, or key pair the service demands. It goes
in through one verb and never comes out. The connection shows only that a
credential is set and when. Rotating means setting it again.

## What a credential looks like

- **Connection.** the one it belongs to.
- **Set by, at.** who and when.
- **Fingerprint.** a short hash to tell one credential from the next; never
  the material.

## Use cases

| File | What it does |
|---|---|
| `set.ts` | Store or rotate a connection's secret. |

## Exposure

Exposed through `PUT /connections/:id/credentials`. Contracts:
[/connections/:id/credentials](../../../api/connections/[id]/credentials/README.md).

## How it relates to the rest

Belongs to a [connection](../README.md). Stored through the secrets vault
named in [ports](../README.md). Setting it shows in
[activity](../../activity/README.md) as a fact, without the material.
