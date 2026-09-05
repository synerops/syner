<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">list</h1>

<p align="center">
  <strong>List delegations in an organization.</strong>
</p>

Returns delegations, filtered by human, agent, or status, in pages.

## Example

```ts
const page = await syner.identity.delegations.list({ organization: 'acme', status: 'active' })
```

In the CLI: `syner identity delegations list --status active`.

## What happens next

This is the answer to which agents act for whom right now.
