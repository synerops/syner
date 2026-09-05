<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">cancel</h1>

<p align="center">
  <strong>Stop a run.</strong>
</p>

Stops a queued or running run and whatever it started.

## Example

```ts
await syner.jobs.runs.cancel({ id })
```

In the CLI: `syner jobs runs cancel <id>`.

## What happens next

The run's events end with a cancellation entry.
