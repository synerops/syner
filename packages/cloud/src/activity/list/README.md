<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">list</h1>

<p align="center">
  <strong>Read the history.</strong>
</p>

Returns entries newest first, filtered by resource, actor, action, outcome, or
time window, in pages.

## Example

```ts
const page = await syner.activity.list({ organization: 'acme', resource: { kind: 'app', id: appId }, since: '2026-03-01' })
```

In the CLI: `syner activity list --app billing --since 2026-03-01`.

## What happens next

Filter by `outcome: denied` to see who tried what and was refused.
