<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">list</h1>

<p align="center">
  <strong>List the members of an organization.</strong>
</p>

Returns members with their roles, in pages.

## From the SDK

```ts
const page = await syner.organizations.members.list({ organization: 'acme' })
```

## From the CLI

```bash
syner organizations members list acme
```

The same call through the raw API. The path is the node; the body is the
input.

```bash
syner api organizations/members/list '{"organization": "acme"}'
```

## Response

```json
{
  "items": [
    {
      "organizationId": "org_3f9k",
      "principalId": "prn_ana",
      "role": "owner",
      "addedBy": "prn_ana",
      "addedAt": "2026-09-04T18:20:00Z"
    }
  ],
  "next": null
}
```
