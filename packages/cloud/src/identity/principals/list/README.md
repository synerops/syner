<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">list</h1>

<p align="center">
  <strong>List the principals of an organization.</strong>
</p>

Returns principals, filtered by kind, in pages.

## From the SDK

```ts
const page = await syner.identity.principals.list({
  organization: 'acme',
  kind: 'agent',
})
```

## From the CLI

```bash
syner identity principals list --kind agent
```

The same call through the raw API. The path is the node; the body is the
input.

```bash
syner api identity/principals/list '{"organization": "acme", "kind": "agent"}'
```

## Response

```json
{
  "items": [
    {
      "id": "prn_bot",
      "kind": "agent",
      "name": "Syner Bot",
      "subject": "auth|syner-bot",
      "status": "active",
      "firstSeenAt": "2026-09-04T18:20:00Z",
      "lastSeenAt": "2026-09-04T18:24:30Z"
    }
  ],
  "next": null
}
```
