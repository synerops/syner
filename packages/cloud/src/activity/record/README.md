<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">record</h1>

<p align="center">
  <strong>Append an entry.</strong>
</p>

Called by every use case after it acts, and by authorize when it denies.

## Example

```ts
// inside a cloud use case
await activity.record({ organizationId, actor, action: 'apps/create', resource: { kind: 'app', id }, outcome: 'succeeded', details: { after: { name } } })
```

## What happens next

Nothing else. The entry is readable through list at once.
