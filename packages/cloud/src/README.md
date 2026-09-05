<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">src</h1>

<p align="center">
  <strong>The business of Syner, one folder per thing.</strong>
</p>

This is where the cloud is defined. Every folder is a node: a module, a
thing, or a verb. A node's `index` is the node itself; its `README.md`
tells you what it is and how to use it; its `AGENTS.md` fixes the contract
a coding agent implements. Names carry the first meaning; the two documents
finish it.

## How to read a node

- A **module** groups things: [compute](compute/README.md) holds
  environments and executions. Its `index` is the door.
- A **thing** is something the cloud keeps: [apps](apps/README.md),
  [versions](apps/versions/README.md). Its `index` is the schema. Things are
  plural.
- A **verb** is what you do to a thing: [apps/create](apps/create/README.md).
  Its `index` is the use case. Verbs are singular.
- **ports** in every module lists what it needs from infrastructure.

When a module is a single thing, the two coincide and the verbs hang from
the module: [connections](connections/README.md), [jobs](jobs/README.md).

## Capabilities

What agents consume.

| Capability | What it gives an agent |
|---|---|
| [apps](apps/README.md) | a product with an HTTP backend and an optional frontend, with versions and deployments |
| [compute](compute/README.md) | environments to run code in, and each run of it |
| [storage](storage/README.md) | stores holding documents and files |
| [connections](connections/README.md) | access to external services, with the secret kept on the server |
| [jobs](jobs/README.md) | durable work with triggers and runs |

## Controls

What makes it safe and visible for an agent to act for a human, and what
Syner OS reads to answer its five questions.

| Control | Answers | What it holds |
|---|---|---|
| [ops](ops/README.md) | Is it working? | long-running administration actions you can follow |
| [activity](activity/README.md) | What changed? | who did what, with the delegation chain |
| [usage](usage/README.md) | What is it costing? | consumption and budgets |
| [identity](identity/README.md), [permissions](permissions/README.md), [organizations](organizations/README.md) | Who has access? | principals, delegations, permissions, members |
| [purpose](purpose/README.md) | Is it fulfilling its purpose? | the declaration and its evaluations |

## Three things that stay distinct

An [execution](compute/executions/README.md) runs code. A
[job run](jobs/runs/README.md) is one occurrence of a defined job. An
[operation](ops/README.md) tracks a long-running administration action. They
look alike from far away and are never the same thing.
