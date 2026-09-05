<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">start</h1>

<p align="center">
  <strong>Start a run now.</strong>
</p>

Runs the job's action once, outside its schedule.

## Example

```ts
const run = await syner.jobs.runs.start({ job: id })
```

In the CLI: `syner jobs runs start close-month`.

## What happens next

Read it with [get](../get/README.md) until the status is final.
