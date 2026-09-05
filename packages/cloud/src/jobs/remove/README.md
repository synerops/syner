<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">remove</h1>

<p align="center">
  <strong>Remove a job.</strong>
</p>

Cancels active runs and removes the definition. Finished runs stay readable.

## From the SDK

```ts
await syner.jobs.remove({ id })
```

## From the CLI

```bash
syner jobs remove close-month
```

The same call through the raw API. The path is the node; the body is the
input.

```bash
syner api jobs/remove '{"id": "job_6t8y"}'
```

## Response

```json
{
  "ok": true
}
```
