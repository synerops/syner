# api

File-based routing over HTTP. A folder with `index.ts` is a route; its path is
the folder path with `[param]` segments as dynamic parameters. `index.ts` is a
provisional marker: the definitive file name and the shape of its exports are
pending.

## Methods

- `GET` reads or lists; no body; filters and paging are query parameters.
- `POST` creates; `201` with the thing, or `202` with an operation reference
  when the work outlives the request.
- `PUT` replaces whole (documents, files, credentials); `201` when new, `200`
  when replaced.
- `PATCH` changes part of a resource; `200` with the resource.
- `DELETE` removes; `204`, or `202` when the work outlives the request.
- Cancel is `PATCH` on an explicit `/cancel` route, after Vercel's `PATCH
  /v12/deployments/{id}/cancel`: it requests a stop, keeps the record, and
  answers `200` with the thing's status; a finished thing is returned
  unchanged.
- No `/update` or `/remove` routes. Actions without an agreed method are
  proposals: documented in a folder without `index.ts`, never exposed.

## Rules

- Only entries inside `api/` are exposed. Folders in `lib/`, schemas, and
  Markdown files never become endpoints.
- The main identifier is `[id]`; the resource is the previous segment. Nested
  identifiers use distinct names (`[deploymentId]`, `[runId]`).
- A route documents every method it carries. An operation maps to one use case
  in [lib](../lib/AGENTS.md); the route validates and authenticates, the use
  case decides.
- Every request carries `Authorization: Bearer <token>`; how tokens are issued
  belongs to the authentication provider, which is open.
- Authorization is not implemented in routes: every use case calls
  [lib/permissions](../lib/permissions/AGENTS.md) itself.
- A `202` carries a reference from
  [lib/operations](../lib/operations/AGENTS.md) in the body; the route never
  blocks. Executions and job runs return `201` with their own status instead.
- Errors: `404` not found, `403` not authorized, `409` conflict, `422` invalid
  input, `413` too large, `503` dependency unavailable.
- Internal operations (`usage.record`, `activity.record`) have no route.
- Consumer-facing operations of the shared responsibilities have no route yet;
  do not invent one.

## Process

`apps/api` is the process that will serve these entries over HTTP. The
discovery, loading, and validation mechanism is not implemented and not
chosen.

## Pending

- Handler names and signatures; route discovery, loading, and validation.
- Transport of the organization context.
- Public location of the shared responsibilities and of the operations route.
- The rollback proposal; the `syner api` flag syntax; multi-segment `[key]`
  and `[path]`; streaming for files.
- Schema and SDK publication or generation.
