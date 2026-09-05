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

## Example

```ts
const decision = await syner.permissions.authorize({ action: 'apps:create', resource: { kind: 'organization', id: orgId } })
```

In the CLI: `syner permissions authorize apps:create --organization acme`.

## What happens next

A denied decision carries the reason: no permission, disabled principal,
delegation expired, outside delegation scope.
