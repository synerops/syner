# src

Spec first, code later. Every `.ts` file is empty; `index.ts` is the
provisional marker of a route. Nothing here presents a placeholder as
implemented.

## Layers

- `apps.ts`, `compute.ts`, `storage.ts`, `connections.ts`, `jobs.ts`: the
  library entries of the five capabilities. Empty in this stage.
- [api/](api/AGENTS.md): external entries the server recognizes by file-based
  routing, over HTTP: `GET` reads, `POST` creates, `PUT` replaces, `PATCH`
  changes part, `DELETE` removes, and cancel is `PATCH` on a `/cancel` route.
  Only a folder with `index.ts` under `api/` is exposed. A folder in `lib/`,
  a schema, or a Markdown file is never an endpoint by itself.
- [lib/](lib/AGENTS.md): models, use cases, shared rules, and the interfaces
  infrastructure implements. Capabilities and shared responsibilities sit as
  siblings; their documents say which is which.
- `utils/`: technical helpers with no business knowledge. Created only when
  one is identified. Permissions, organizations, and usage never go there.

## Dependency direction

`api/` calls `lib/`. The five entries re-export `lib/`. `lib/` modules call
each other through their models and use cases. Neither `lib/` nor the five
entries import `api/`. The server process, `apps/api`, is the one place that
loads the entries in `api/`; that mechanism is not implemented.

## Rules every use case obeys

- Authorization goes through [lib/permissions](lib/permissions/AGENTS.md),
  deny by default. The acting principal comes from the request context.
- Every mutation appends an entry in [lib/activity](lib/activity/AGENTS.md).
- Work that outlives a request returns a reference from
  [lib/operations](lib/operations/AGENTS.md). Executions and job runs carry
  their own status instead.
- Consumption is recorded in [lib/usage](lib/usage/AGENTS.md) by the use case
  that caused it.
- Schemas and types live with their owner. There is no central `contracts`
  or `schemas` package.

## Open decisions

Decided: the API is HTTP with the methods above. Not to be chosen implicitly
by scaffolding: handler names and signatures; discovery, loading, and
validation of routes; transport of the organization context; publication or
generation of schemas and SDK; framework, providers, database, queue, and
authentication.
