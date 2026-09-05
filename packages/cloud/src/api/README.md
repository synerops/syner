<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">api</h1>

<p align="center">
  <strong>The external contract, by HTTP method and route.</strong>
</p>

The API is HTTP. The tree under `api/` is the routing table: a folder with
`index.ts` is a route, its name is the path segment, `[id]` is a dynamic
segment. The resource is named by the segment before the parameter, so the
main identifier is always `[id]`; nested identifiers get their own names. Each
route's `README.md` is the contract, organized by method; its `AGENTS.md`
guides the handler.

```text
api/
└── apps/
    ├── index.ts                          /apps
    └── [id]/
        ├── index.ts                      /apps/:id
        └── deployments/
            ├── index.ts                  /apps/:id/deployments
            └── [deploymentId]/
                └── index.ts              /apps/:id/deployments/:deploymentId
```

## Methods

| Intent | Method | Success |
|---|---|---|
| Read or list | `GET` | `200` |
| Create | `POST` | `201`, or `202` when the work outlives the request |
| Replace whole | `PUT` | `200`, `201` when new |
| Change part | `PATCH` | `200` |
| Remove | `DELETE` | `204`, or `202` when the work outlives the request |
| Cancel | `PATCH` on an explicit `/cancel` route | `200` with the thing's status |
| Promote a deployment to an environment's domain | `POST` on `/promote/:deploymentId` | `202` with an operation; the domain switches when it completes |

No `/update` or `/remove` routes: the method on the resource says it.
Cancellation follows Vercel, `PATCH /v12/deployments/{id}/cancel`: it asks the
work to stop, keeps the record, and does not promise an immediate stop. A
`202` carries an operation reference in the body; the `Location` header will
point to the operations route once its public location is agreed. Errors map
to `404` not found, `403` not authorized, `409` conflict, `422` invalid input,
`413` too large, `503` a dependency unavailable.

## Routes (established)

| Method | Route | Use case | Success |
|---|---|---|---|
| `GET` | `/apps` | [list](apps/README.md) | 200 |
| `POST` | `/apps` | [create](apps/README.md) | 201 |
| `GET` | `/apps/:id` | [get](apps/[id]/README.md) | 200 |
| `PATCH` | `/apps/:id` | [update](apps/[id]/README.md) | 200 |
| `DELETE` | `/apps/:id` | [remove](apps/[id]/README.md) | 202 |
| `GET` | `/apps/:id/versions` | [list](apps/[id]/versions/README.md) | 200 |
| `POST` | `/apps/:id/versions` | [create](apps/[id]/versions/README.md) | 201 |
| `GET` | `/apps/:id/versions/:versionId` | [get](apps/[id]/versions/[versionId]/README.md) | 200 |
| `GET` | `/apps/:id/environments` | [list](apps/[id]/environments/README.md) | 200 |
| `POST` | `/apps/:id/environments` | [create](apps/[id]/environments/README.md) | 201 |
| `GET` | `/apps/:id/environments/:environmentId` | [get](apps/[id]/environments/[environmentId]/README.md) | 200 |
| `PATCH` | `/apps/:id/environments/:environmentId` | [update](apps/[id]/environments/[environmentId]/README.md) | 200 |
| `DELETE` | `/apps/:id/environments/:environmentId` | [remove](apps/[id]/environments/[environmentId]/README.md) | 202 |
| `POST` | `/apps/:id/environments/:environmentId/promote/:deploymentId` | [promote](apps/[id]/environments/[environmentId]/promote/[deploymentId]/README.md) | 202 |
| `GET` | `/apps/:id/deployments` | [list](apps/[id]/deployments/README.md) | 200 |
| `POST` | `/apps/:id/deployments` | [create](apps/[id]/deployments/README.md) | 202 |
| `GET` | `/apps/:id/deployments/:deploymentId` | [get](apps/[id]/deployments/[deploymentId]/README.md) | 200 |
| `GET` | `/compute/environments` | [list](compute/environments/README.md) | 200 |
| `POST` | `/compute/environments` | [create](compute/environments/README.md) | 202 |
| `GET` | `/compute/environments/:id` | [get](compute/environments/[id]/README.md) | 200 |
| `DELETE` | `/compute/environments/:id` | [remove](compute/environments/[id]/README.md) | 202 |
| `GET` | `/compute/executions` | [list](compute/executions/README.md) | 200 |
| `POST` | `/compute/executions` | [start](compute/executions/README.md) | 201 |
| `GET` | `/compute/executions/:id` | [get](compute/executions/[id]/README.md) | 200 |
| `PATCH` | `/compute/executions/:id/cancel` | [cancel](compute/executions/[id]/cancel/README.md) | 200 |
| `GET` | `/storage/stores` | [list](storage/stores/README.md) | 200 |
| `POST` | `/storage/stores` | [create](storage/stores/README.md) | 202 |
| `GET` | `/storage/stores/:id` | [get](storage/stores/[id]/README.md) | 200 |
| `DELETE` | `/storage/stores/:id` | [remove](storage/stores/[id]/README.md) | 202 |
| `GET` | `/storage/stores/:id/documents` | [list](storage/stores/[id]/documents/README.md) | 200 |
| `PUT` | `/storage/stores/:id/documents/:key` | [put](storage/stores/[id]/documents/[key]/README.md) | 200/201 |
| `GET` | `/storage/stores/:id/documents/:key` | [get](storage/stores/[id]/documents/[key]/README.md) | 200 |
| `DELETE` | `/storage/stores/:id/documents/:key` | [remove](storage/stores/[id]/documents/[key]/README.md) | 204 |
| `GET` | `/storage/stores/:id/files` | [list](storage/stores/[id]/files/README.md) | 200 |
| `PUT` | `/storage/stores/:id/files/:path` | [put](storage/stores/[id]/files/[path]/README.md) | 200/201 |
| `GET` | `/storage/stores/:id/files/:path` | [get](storage/stores/[id]/files/[path]/README.md) | 200 |
| `DELETE` | `/storage/stores/:id/files/:path` | [remove](storage/stores/[id]/files/[path]/README.md) | 204 |
| `GET` | `/connections` | [list](connections/README.md) | 200 |
| `POST` | `/connections` | [create](connections/README.md) | 201 |
| `GET` | `/connections/:id` | [get](connections/[id]/README.md) | 200 |
| `DELETE` | `/connections/:id` | [remove](connections/[id]/README.md) | 204 |
| `PUT` | `/connections/:id/credentials` | [set](connections/[id]/credentials/README.md) | 200 |
| `POST` | `/connections/:id/grants` | [grant](connections/[id]/grants/README.md) | 201 |
| `DELETE` | `/connections/:id/grants/:granteeId` | [revoke](connections/[id]/grants/[granteeId]/README.md) | 204 |
| `GET` | `/jobs` | [list](jobs/README.md) | 200 |
| `POST` | `/jobs` | [create](jobs/README.md) | 201 |
| `GET` | `/jobs/:id` | [get](jobs/[id]/README.md) | 200 |
| `PATCH` | `/jobs/:id` | [update](jobs/[id]/README.md) | 200 |
| `DELETE` | `/jobs/:id` | [remove](jobs/[id]/README.md) | 204 |
| `GET` | `/jobs/:id/runs` | [list](jobs/[id]/runs/README.md) | 200 |
| `POST` | `/jobs/:id/runs` | [start](jobs/[id]/runs/README.md) | 201 |
| `GET` | `/jobs/:id/runs/:runId` | [get](jobs/[id]/runs/[runId]/README.md) | 200 |
| `PATCH` | `/jobs/:id/runs/:runId/cancel` | [cancel](jobs/[id]/runs/[runId]/cancel/README.md) | 200 |

Rollback is not a route: it is `POST
/apps/:id/environments/:environmentId/promote/:deploymentId` with an earlier
available deployment, the intent Vercel expresses as `POST
/v1/projects/{projectId}/rollback/{deploymentId}`. Nothing is rebuilt.

## Not here yet

The shared responsibilities have consumer-facing operations that need a public
representation, and their location is not agreed. Nothing under `api/` exists
for them, and no namespace is invented to force it. The methods they will use
follow the table above.

| Owner | Consumer-facing operations | Internal only |
|---|---|---|
| [lib/organizations](../lib/organizations/README.md) | create, get, list, remove; members add, remove, list |  |
| [lib/identity](../lib/identity/README.md) | principals get, list; delegations create, revoke, get, list |  |
| [lib/permissions](../lib/permissions/README.md) | grant, revoke, list, authorize |  |
| [lib/operations](../lib/operations/README.md) | get, list, cancel |  |
| [lib/usage](../lib/usage/README.md) | get; budgets set, get | record |
| [lib/activity](../lib/activity/README.md) | list | record |

## Raw calls with `syner api`

`syner api <route>` sends an authenticated request to a route in this tree,
the way `vercel api` does for Vercel. The route is one of the paths above with
real ids; the body uses the contract's field names and identifiers, never
names. Resolving a name such as `billing` to its id is a convenience of the
CLI's own commands, and how they do it is pending. The flags are a proposal
that mirrors `vercel api`: `-X` selects the method, GET by default; `-F
key=value` adds a field; `--input file` sends a body from a file, `-` for
stdin; `-H` adds a header. `syner api` reaches routes only: a folder in `lib/`
is never a target.

```bash
syner api /apps/app_7c3a
syner api /apps/app_7c3a -X PATCH -F name=billing-eu
syner api /apps/app_7c3a/deployments -X POST -F versionId=ver_9b21
syner api /compute/executions/exe_c41d/cancel -X PATCH
```

## CLI experience (agreed)

```text
syner apps          Apps running in the selected context
syner apps --all    Every app, with its status
```

The intent stands. An app now has several environments, each with a promoted
deployment or none; how `syner apps` summarizes them, which environment it
reads to say running, and how a person selects another are pending. No
environment is a default, and `GET /apps` has no `running` filter until this
is decided.

## Pending

- Name and signature of the handler exports; `index.ts` is a marker until
  then.
- Discovery, loading, and validation of routes.
- How the organization context travels: query, header, or path prefix. Until
  agreed it is an explicit `organizationId` field in query or body.
- Public location of the shared responsibilities, including the operations
  route a `202` would point to.
- Promotion of a deployment made before a configuration change: allowed as is,
  or deploy again. No default is specified.
- Whether an app gets a default environment at creation, and how `syner apps`
  summarizes several environments.
- Capture of multi-segment keys and paths in `[key]` and `[path]`; streaming
  mechanics for files.
- The `syner api` flag syntax, proposed after `vercel api`.
- Publication or generation of schemas and SDK.
