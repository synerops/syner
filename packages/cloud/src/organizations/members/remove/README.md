<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">remove</h1>

<p align="center">
  <strong>Remove a member.</strong>
</p>

Takes a principal out of the organization and revokes what came with the
membership.

## Example

```ts
await syner.organizations.members.remove({ organization: 'acme', principal: anaId })
```

In the CLI: `syner organizations members remove acme ana@acme.com`.

## What happens next

Their delegations and permissions in this organization are gone.
