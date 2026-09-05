<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">lib</h1>

<p align="center">
  <strong>Models, use cases, rules, and what infrastructure must implement.</strong>
</p>

One folder per module. Inside, a noun file is the model (`app.ts`), a verb
file is one use case (`create.ts`), `ports.ts` lists the interfaces the
module needs from infrastructure, and a subfolder is a thing the module owns
with a lifecycle of its own (`apps/versions`). Each folder explains itself
in `README.md` and guides its implementation in `AGENTS.md`.

## Capabilities

| Module | Owns |
|---|---|
| [apps](apps/README.md) | an app, its versions, its deployments, and its purpose |
| [compute](compute/README.md) | environments and executions |
| [storage](storage/README.md) | stores, documents, and files |
| [connections](connections/README.md) | connections, their credentials, and their grants |
| [jobs](jobs/README.md) | jobs and their runs |

## Shared responsibilities

| Module | Owns |
|---|---|
| [organizations](organizations/README.md) | organizations and members |
| [identity](identity/README.md) | principals and delegations |
| [permissions](permissions/README.md) | permissions and the authorization check |
| [operations](operations/README.md) | long-running administration actions |
| [usage](usage/README.md) | usage records and budgets |
| [activity](activity/README.md) | the history of who did what |

## Exposure

A module's README says where its use cases are exposed in
[api](../api/README.md), or that the location is pending. Being in `lib/`
says nothing about being public or private; the documents do.
