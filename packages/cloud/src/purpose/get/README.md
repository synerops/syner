<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">get</h1>

<p align="center">
  <strong>Read an app's purpose.</strong>
</p>

Returns the declaration with its latest evaluation.

## Example

```ts
const p = await syner.purpose.get({ app: 'billing' })
```

In the CLI: `syner purpose get billing`.

## What happens next

Ask for `history: true` to get every evaluation, newest first.
