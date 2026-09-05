# /apps

Route marked by `index.ts`. Params: none. Each operation validates its input,
resolves the acting principal from the bearer token, and calls one use case in
[lib/apps](../../lib/apps/AGENTS.md).

## Operations

### GET

- `GET /apps` calls `list.ts` in [lib/apps](../../lib/apps/AGENTS.md).
- Input: `organizationId` required; taken from the shared context when the
  request carries one.; `running` optional. `true` returns only apps whose
  current deployment is `live`, an administrative state, not a health check.
  This is what `syner apps` asks; `syner apps --all` omits it.; `cursor,
  limit` paging; limit defaults to the cloud's page size.
- Success: `200`. A page: `items[]` and `next`. Each item is the app with
  `currentDeployment` (`id`, `status`, `url`) when it has one, so a caller can
  tell running from stopped.
- Authorization: the principal needs `apps:read` on the organization, checked
  through [permissions/authorize](../../lib/permissions/AGENTS.md).
- Runs in-request. It returns a page, not an
  [operation](../../lib/operations/AGENTS.md).
- The acting principal comes from the request context, never from the input.
- Errors: `404` organization not found, `403` not authorized.

### POST

- `POST /apps` calls `create.ts` in [lib/apps](../../lib/apps/AGENTS.md).
- Input: `organizationId` the owner.; `name` unique within the organization.;
  `backend` `runtime`, `entry`, `env[]`.; `frontend` optional.; `purpose`
  optional; the app's purpose as described in purpose/.
- Success: `201`. The app as stored, with `currentDeploymentId` empty.
- Authorization: the principal needs `apps:create` on the organization,
  checked through [permissions/authorize](../../lib/permissions/AGENTS.md).
- When the principal is an agent acting under a delegation, the check applies
  to the human's permissions, never to a wider set.
- Runs in-request. It returns the app, not an
  [operation](../../lib/operations/AGENTS.md).
- The acting principal comes from the request context, never from the input.
- Errors: `404` organization not found, `403` not authorized, `409` name
  taken, `422` invalid backend.

## Pending

- Name and signature of the handler exports; `index.ts` is a marker until
  then.
- Discovery, loading, and validation of routes.
- How the organization context travels (query, header, or path prefix); until
  agreed it is an explicit field.
- Publication or generation of schemas and SDK.
