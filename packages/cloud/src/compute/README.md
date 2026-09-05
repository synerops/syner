<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">compute</h1>

<p align="center">
  <strong>Environments to run code in, and each run of it.</strong>
</p>

Agents need somewhere to run code that is not their own machine. Compute gives
them an environment, an isolated runtime with resources, and lets them start
executions inside it. An execution is one run of a command: it has a status
while it lasts and a result when it ends. Environments can be explicit or
allocated on the fly when an execution asks for one.

## What's inside

| Thing | What it is |
|---|---|
| [environments](environments/README.md) | where code runs: an isolated runtime with a lifetime. |
| [executions](executions/README.md) | one run of a command inside an environment, with its result. |

## How it relates to the rest

Compute is for agents that need to run code. Whether an app's backend runs
here or on a provider is decided per deployment in
[apps/deployments](../apps/deployments/README.md). A [job
run](../jobs/runs/README.md) can start an execution, and remains a different
thing. Executions carry their own status and are never
[operations](../ops/README.md).
