<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">deployments</h1>

<p align="center">
  <strong>A version of an app put into service.</strong>
</p>

A deployment takes one version and makes it answer at a URL. At most one
deployment is live per app; deploying a new one retires the previous. A
rollback is a new deployment of an older version, never an edit of an old one.
Deploying takes time, so it runs as an operation you can follow.

## What a deployment looks like

- **Version.** the snapshot being served.
- **Status.** pending, live, failed, or retired.
- **URL.** where it answers, once live.
- **Target.** where it runs: a compute environment or a provider.
- **Operation.** the long-running work that created it.
- **Started by, at; finished at.** who and when.

## Use cases

| File | What it does |
|---|---|
| `create.ts` | Put a version into service. |
| `get.ts` | Read one deployment. |
| `list.ts` | List the deployments of an app. |
| `rollback.ts` | Serve a previous version again. |

## Exposure

Exposed through `POST /apps/:id/deployments`, `GET
/apps/:id/deployments/:deploymentId`, `GET /apps/:id/deployments`. Contracts:
[/apps/:id/deployments](../../../api/apps/[id]/deployments/README.md),
[/apps/:id/deployments/:deploymentId](../../../api/apps/[id]/deployments/[deploymentId]/README.md).
Proposed, not agreed: `POST /apps/:id/rollback/:deploymentId` for `rollback`;
see [the proposal](../../../api/apps/[id]/rollback/[deploymentId]/README.md).

## How it relates to the rest

Every deployment points at a [version](../versions/README.md). Its progress is
an [operation](../../operations/README.md). Whether the app runs on
[compute](../../compute/README.md) or on a provider is the deployment's
target, chosen here. A rollback changes which code runs; the data the app
wrote stays as it is.
