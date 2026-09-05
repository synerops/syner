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
jobs) and the shared responsibilities that make an agent's actions safe and
visible (organizations, identity, permissions, operations, usage,
activity). `apps/api` and `jobs/worker` call it directly; everything else
reaches it through the API.

## Layout

[`src`](src/README.md) has three layers: five library entries, one per
capability; [`api`](src/api/README.md), the external contract as
file-based routes; and [`lib`](src/lib/README.md), the models, use cases,
rules, and interfaces. This is a spec: every `.ts` file is empty, and the
documents say what is agreed and what is pending.

## Who touches it

- [`apps/api`](../../apps/api/README.md) will serve the routes declared in
  `src/api`. The mechanism is not implemented.
- [`jobs/worker`](../../jobs/worker/README.md) executes the long-running use
  cases and reports through operations.
- [`@syner/infrastructure`](../infrastructure/README.md) implements every
  interface listed in the `ports.ts` files.
