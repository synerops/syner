<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">environments</h1>

<p align="center">
  <strong>A context to run an app in: configuration, resources, access, a stable domain, and a promoted deployment.</strong>
</p>

An environment is where a version of an app runs and under which rules. It
holds the configuration values the backend expects, the connections and stores
it may use, who may deploy and promote in it, and a stable domain. Several
deployments can be available in one environment at the same time; exactly one
of them, or none, is promoted to answer at the stable domain. Environments can
be persistent, like production or staging, or temporary, created for a branch,
a pull request, an experiment, or by hand. The model does not tie them to any
Git strategy.

These are application environments. They are not the compute environments
where agents run code; the two share a word and nothing else.

## What an environment looks like

- **Name.** unique inside the app: `production`, `staging`, `preview`,
  `pr-42`, or whatever the organization chooses. No name is a default.
- **Lifetime.** persistent, or temporary with an optional expiry.
- **Configuration.** the values for the variables the backend expects, and
  references to secrets.
- **Resources.** the connections granted and the stores associated to this
  environment.
- **Access.** who may deploy here and who may promote a deployment to the
  domain.
- **Stable domain.** the address that always answers with the promoted
  deployment.
- **Promoted deployment.** the one deployment answering at the stable domain,
  or none.
- **Origin.** optional: the branch, pull request, or automation it was created
  for.
- **Created by, at; expires at.** who and when.

## Use cases

| File | What it does |
|---|---|
| `create.ts` | Create an environment for an app. |
| `get.ts` | Read one environment. |
| `list.ts` | List the environments of an app. |
| `update.ts` | Change an environment's name, lifetime, configuration, resources, or access. |
| `promote.ts` | Point the stable domain at an available deployment. |
| `remove.ts` | Remove an environment. |

## Exposure

Exposed through `POST /apps/:id/environments`, `GET
/apps/:id/environments/:environmentId`, `GET /apps/:id/environments`, `PATCH
/apps/:id/environments/:environmentId`, `POST
/apps/:id/environments/:environmentId/promote/:deploymentId`, `DELETE
/apps/:id/environments/:environmentId`. Contracts:
[/apps/:id/environments](../../../api/apps/[id]/environments/README.md),
[/apps/:id/environments/:environmentId](../../../api/apps/[id]/environments/[environmentId]/README.md),
[/apps/:id/environments/:environmentId/promote/:deploymentId](../../../api/apps/[id]/environments/[environmentId]/promote/[deploymentId]/README.md).

## What it needs from infrastructure

[infrastructure.ts](../infrastructure.ts), the app module's list: persistence
for environments, and a domain routing provider that binds the stable domain
to a deployment's address and confirms when traffic has switched. Saving
`promotedDeploymentId` is not the switch; the provider is.

## How it relates to the rest

[Deployments](../deployments/README.md) are created inside an environment and
stay available there until retired; promoting one to the domain does not
destroy another. [Versions](../versions/README.md) are shared by all
environments of the app. [Connections](../../connections/README.md) and
[stores](../../storage/README.md) are referenced per environment. Access is
checked through [permissions](../../permissions/README.md) with the
environment as the resource. Consumption is attributed per environment in
[usage](../../usage/README.md).
