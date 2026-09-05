<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">add</h1>

<p align="center">
  <strong>Add a member.</strong>
</p>

Adds a principal with a role, or changes the role of an existing member.

## Example

```ts
await syner.organizations.members.add({ organization: 'acme', principal: anaId, role: 'admin' })
```

In the CLI: `syner organizations members add acme ana@acme.com --role admin`.

## What happens next

The member's permissions follow the role at once.
