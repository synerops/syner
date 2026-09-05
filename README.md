<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="96"/>
  </picture>
</p>

<h1 align="center">Syner</h1>

<p align="center">
  <strong>A Cloud for Agents.</strong>
</p>

Syner gives agents the cloud they need to do real work: a place to create
apps, run code, keep data, reach external services, and leave jobs
running. Syner OS is the control panel where your organization sees what
its agents did and steps in when something changes. Syner is also an
agent of its own: it runs on your machine as a CLI or hosted as Syner
Bot, and it operates Syner OS for you.

<!-- prettier-ignore -->
> [!NOTE]
> This repository is being rewritten. The structure below is the target;
> most modules are placeholders today, and existing code is legacy until
> it's migrated.

## Five capabilities

Agents consume the cloud through five capabilities. Each one works on its
own, and an app can use all of them.

| Capability | What it gives an agent |
|---|---|
| Apps | An HTTP backend with an optional frontend, with versions and deployments |
| Compute | Environments to run code in, and their results |
| Storage | Data and files that outlive a session |
| Connections | Access to external services, with credentials kept on the server |
| Jobs | Durable work with triggers, events, and runs |

## Syner OS

Syner OS answers five questions about your apps: Is it working? What
changed? What is it costing? Who has access? Is it fulfilling its
purpose? The controls behind the first four apply across every
capability: organizations, identity, permissions, operations, usage, and
activity. What an app is for is part of the app's own spec; how to measure
whether it fulfills it is not decided yet. When an agent acts for you, it
does so with your identity and within your permissions, and the activity
log says so.

## Syner, the agent

`syner` is one agent with two runtimes. On your machine it's the CLI:

```sh
bunx syner apps create
```

Hosted at syner.bot it's Syner Bot. It meets you in messaging channels
and operates Syner OS on your behalf.

## Ecosystem

Everything reaches the cloud through the administration API, and every
package but `syner` lives under the `@syner` scope.

| Package | Role |
|---|---|
| `syner` | The agent and the CLI |
| `@syner/sdk` | Typed client of the API |
| `@syner/mcp` | MCP server for agents that speak MCP |
| `@syner/cloud` | The business: capabilities and controls |
| `@syner/infrastructure` | Persistence and provider adapters |
| `@syner/ui` | Shared components |

## Repository

| Path | What runs or lives there |
|---|---|
| `apps/api` | Administration API |
| `jobs/worker` | Durable platform work |
| `apps/app` | Syner OS, at syner.app |
| `apps/bot` | Syner Bot, at syner.bot |
| `apps/web` | Public site |
| `packages/*` | The packages in the table above |

The package manager is `bun` and builds run through Turbo. Each folder
carries an `AGENTS.md` written for coding agents; packages and processes
also carry a `README.md` written for you.
