<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">ports</h1>

<p align="center">
  <strong>What apps needs from infrastructure.</strong>
</p>

Apps decides; infrastructure does. This node lists the interfaces apps calls
to persist its things and to reach the outside world. Nothing here names a
database or a vendor: that choice belongs to
[infrastructure](../../../../infrastructure/README.md), which implements every
interface listed here, one adapter per interface.

## Persistence

- **apps.** save, load by id or by organization and name, list by
  organization, mark removed.
- **versions.** save, load by app and number, list by app; append-only.
- **deployments.** save, load, list by app and status, update status.

## Providers

- **deployment target.** put a version into service at a target and report its
  URL; retire a deployment; report status.
- **artifacts.** store a version's captured code and hand it back to the
  deployment target.

## Who implements it

[infrastructure](../../../../infrastructure/README.md): its persistence folder
for the persistence interfaces, its providers folder for the provider
interfaces. [api](../../../../../apps/api/README.md) and
[worker](../../../../../apps/worker/README.md) wire the adapters in; apps
never imports them.
