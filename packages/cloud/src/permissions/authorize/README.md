<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">authorize</h1>

<p align="center">
  <strong>Decide whether a principal may perform an action on a resource.</strong>
</p>

This is the question every use case asks before doing anything. It looks at
the principal's roles, explicit grants, and, when the principal is an agent,
the delegation it acts under. The answer is allowed or denied, with the
reason.

## From the SDK

```ts
const decision = await syner.permissions.authorize({
  action: 'apps:create',
  resource: {
    kind: 'organization',
    id: orgId,
  },
})
```

## From the CLI

```bash
syner permissions authorize apps:create --organization acme
```

The same call through the raw API. The path is the node; the body is the
input.

```bash
syner api permissions/authorize '{
  "action": "apps:create",
  "resource": {
    "kind": "organization",
    "id": "org_3f9k"
  }
}'
```

## Response

```json
{
  "allowed": false,
  "reason": "delegation del_2m4n is scoped to app_7c3a"
}
```
