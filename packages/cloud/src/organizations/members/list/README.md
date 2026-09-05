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

## Example

```ts
const page = await syner.organizations.members.list({ organization: 'acme' })
```

In the CLI: `syner organizations members list acme`.

## What happens next

Filter by `role` or by `kind` of principal to see humans or agents only.
