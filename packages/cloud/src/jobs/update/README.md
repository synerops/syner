<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">update</h1>

<p align="center">
  <strong>Change a job's action, triggers, or enabled flag.</strong>
</p>

Applies to future runs. Running runs finish under the old definition.

## Example

```ts
await syner.jobs.update({ id, enabled: false })
```

In the CLI: `syner jobs update close-month --disable`.

## What happens next

Triggers pick up the change immediately.
