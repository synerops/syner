<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">list</h1>

<p align="center">
  <strong>List the organizations you belong to.</strong>
</p>

Returns the organizations where the acting principal is a member.

## From the SDK

```ts
const page = await syner.organizations.list()
```

## From the CLI

```bash
syner organizations list
```

The same call through the raw API. The path is the node; the body is the
input.

```bash
syner api organizations/list '{}'
```

## Response

```json
{
  "items": [
    {
      "id": "org_3f9k",
      "slug": "acme",
      "name": "Acme Inc.",
      "status": "active",
      "createdBy": "prn_ana",
      "createdAt": "2026-09-04T18:20:00Z"
    }
  ],
  "next": null
}
```
