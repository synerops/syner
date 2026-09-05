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

The five capabilities agents consume (apps, compute, storage, connections, jobs)
and the shared controls that make an agent's actions safe and visible
(organizations, identity, permissions, operations, usage, activity, purpose).
`apps/api` and `apps/worker` call it directly; everything else reaches it
through the API.

<!-- prettier-ignore -->
> [!NOTE]
> This package is a scaffold: module boundaries with empty files.

## Layout

Each folder under `src/` is one module. A noun file holds a concept and
its schema (`apps/app.ts`), a verb file is one use case
(`apps/create.ts`), and a subfolder is a concept the parent owns with a
lifecycle of its own (`apps/deployments/`). The package defines the
persistence and provider interfaces it needs, and `@syner/infrastructure`
implements them.
