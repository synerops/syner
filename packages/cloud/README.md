<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">@syner/cloud</h1>

<p align="center">
  <strong>The business of Syner.</strong>
</p>

The five capabilities agents consume (apps, compute, storage, connections,
jobs) and the seven controls that make an agent's actions safe and visible
(organizations, identity, permissions, ops, usage, activity, purpose).
`apps/api` and `apps/worker` call it directly; everything else reaches
it through the API.

## Layout

Everything lives under [`src`](src/README.md), one folder per node. A
module groups things, a thing holds a schema, a verb is one use case, and
`ports` says what the module needs from infrastructure. Each node carries
its own `README.md` and `AGENTS.md`, so you can start anywhere and follow
the links.

## Who touches it

- [`apps/api`](../../apps/api/README.md) authenticates a request and calls
  a verb with the actor and organization.
- [`apps/worker`](../../apps/worker/README.md) executes the long-running
  verbs and reports through ops.
- [`@syner/infrastructure`](../infrastructure/README.md) implements every
  interface listed in the `ports` nodes.
