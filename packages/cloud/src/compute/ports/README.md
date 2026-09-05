<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">ports</h1>

<p align="center">
  <strong>What compute needs from infrastructure.</strong>
</p>

Compute decides; infrastructure does. This node lists the interfaces compute
calls to persist its things and to reach the outside world. Nothing here names
a database or a vendor: that choice belongs to
[infrastructure](../../../../infrastructure/README.md), which implements every
interface listed here, one adapter per interface.

## Persistence

- **environments.** save, load, list by organization and status, update
  status.
- **executions.** save, load, list by environment or organization and status,
  update status and result.

## Providers

- **runtime.** allocate an environment with a runtime and resources; run a
  command in it and capture its output; stop a command; release the
  environment.

## Who implements it

[infrastructure](../../../../infrastructure/README.md): its persistence folder
for the persistence interfaces, its providers folder for the provider
interfaces. [api](../../../../../apps/api/README.md) and
[worker](../../../../../apps/worker/README.md) wire the adapters in; compute
never imports them.
