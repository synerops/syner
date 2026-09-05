<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">cancel</h1>

<p align="center">
  <strong>Stop a running execution.</strong>
</p>

Asks the runtime to stop the command. The execution ends as cancelled.

## Example

```ts
await syner.compute.executions.cancel({ id })
```

In the CLI: `syner compute executions cancel <id>`.

## What happens next

Read the execution: its result holds whatever output was captured before the
stop.
