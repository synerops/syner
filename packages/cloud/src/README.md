<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">src</h1>

<p align="center">
  <strong>The business of Syner, spec first.</strong>
</p>

Three layers, each with one job. The five files at the root are the library
entries of the five capabilities. `api/` is the external contract over HTTP,
one folder per route and one section per method. `lib/` is where things are
modeled and decided: models, use cases, rules, and the interfaces
infrastructure implements. Every `.ts` file here is empty on purpose: this is
a spec, and the code comes later.

## The five capabilities

Each capability can be used on its own. The authentication and organization
context is shared and exists without an app selected.

| Capability | Library entry | Contract | Owner |
|---|---|---|---|
| apps | `apps.ts` | [api/apps](api/apps/README.md) | [lib/apps](lib/apps/README.md): versions, environments, deployments, purpose |
| compute | `compute.ts` | [api/compute](api/compute/README.md) | [lib/compute](lib/compute/README.md) |
| storage | `storage.ts` | [api/storage](api/storage/README.md) | [lib/storage](lib/storage/README.md) |
| connections | `connections.ts` | [api/connections](api/connections/README.md) | [lib/connections](lib/connections/README.md) |
| jobs | `jobs.ts` | [api/jobs](api/jobs/README.md) | [lib/jobs](lib/jobs/README.md) |

## Shared responsibilities

They live in `lib/` next to the capabilities, without an intermediate folder.
What tells them apart is what they do: they administer ownership and access,
or they follow and measure, across every capability. Their public location
is pending; see [api](api/README.md).

| Responsibility | Owner | What it does |
|---|---|---|
| organizations | [lib/organizations](lib/organizations/README.md) | who owns everything, and who belongs |
| identity | [lib/identity](lib/identity/README.md) | who acts, and who acts for whom |
| permissions | [lib/permissions](lib/permissions/README.md) | who may do what, checked on every call |
| operations | [lib/operations](lib/operations/README.md) | long-running administration actions you can follow |
| usage | [lib/usage](lib/usage/README.md) | what was consumed, and budgets |
| activity | [lib/activity](lib/activity/README.md) | who did what |

## Purpose

What an app is for is part of the app's spec, in
[lib/apps/purpose](lib/apps/purpose/README.md). Measuring whether an app
fulfills it is not agreed; that node says why.

## How to read a node

Every folder carries a `README.md` that explains it and an `AGENTS.md`
that guides its implementation. In `api/`, a folder with `index.ts` is a
route and its documents describe the external contract. In `lib/`, a folder
is a module or a thing it owns; a noun file is its model, a verb file is one
use case, and `infrastructure.ts` lists what it needs from infrastructure.

`utils/` does not exist yet: no technical helper without business knowledge
has been identified.
