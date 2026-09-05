<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">deployments</h1>

<p align="center">
  <strong>A version put to work inside an environment.</strong>
</p>

A deployment takes one version and runs it inside one environment, with that
environment's configuration. It gets an address of its own the moment it is
ready. It answers at the environment's stable domain only when the environment
promotes it. Several deployments can stay available in the same environment;
creating one changes no promotion, and promoting one destroys nothing.
Deploying takes time, so it runs as an operation you can follow.

## What a deployment looks like

- **Version and environment.** which snapshot, in which context.
- **Process.** how the deploy is going: pending, ready, or failed.
- **Availability.** available to be promoted or reached at its own address, or
  retired.
- **Promoted.** derived: whether the environment currently points its domain
  at it.
- **Health.** observed during execution. Not modeled yet: no evidence source
  exists.
- **Address.** its own URL, once ready. The stable domain belongs to the
  environment.
- **Target.** where it runs: a compute environment or a provider.
- **Operation.** the long-running work that created it.
- **Started by, at; finished at.** who and when.

## Use cases

| File | What it does |
|---|---|
| `create.ts` | Put a version into service. |
| `get.ts` | Read one deployment. |
| `list.ts` | List the deployments of an app. |

## Exposure

Exposed through `POST /apps/:id/deployments`, `GET
/apps/:id/deployments/:deploymentId`, `GET /apps/:id/deployments`. Contracts:
[/apps/:id/deployments](../../../api/apps/[id]/deployments/README.md),
[/apps/:id/deployments/:deploymentId](../../../api/apps/[id]/deployments/[deploymentId]/README.md).

## How it relates to the rest

Every deployment points at a [version](../versions/README.md) and lives in an
[environment](../environments/README.md), which promotes one of them to the
stable domain. Its progress is an [operation](../../operations/README.md).
Whether it runs on [compute](../../compute/README.md) or on a provider is its
target. Promoting a version from one environment to another is a new
deployment in the target environment; whether the build is reused is pending.
