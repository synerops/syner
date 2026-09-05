<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">create</h1>

<p align="center">
  <strong>Create an organization.</strong>
</p>

The creating human becomes its first owner.

Add people and agents with [members/add](../members/add/README.md).

## From the SDK

```ts
const org = await syner.organizations.create({
  slug: 'acme',
  name: 'Acme Inc.',
})
```

## From the CLI

```bash
syner organizations create acme --name 'Acme Inc.'
```

The same call through the raw API. The path is the node; the body is the
input.

```bash
syner api organizations/create '{"slug": "acme", "name": "Acme Inc."}'
```

## Response

```json
{
  "id": "org_3f9k",
  "slug": "acme",
  "name": "Acme Inc.",
  "status": "active",
  "createdBy": "prn_ana",
  "createdAt": "2026-09-04T18:20:00Z"
}
```
