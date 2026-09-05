# connections

Owns connections: visible configuration, a write-only credential, and grants
of use.

## Model (`connection.ts`)

- `id`: stable.
- `organizationId`: the owner.
- `name`: unique in the organization.
- `service`: a named kind of service.
- `config`: non-secret settings, a JSON object.
- `credentialSetAt`: optional: when the credential was last set; absent means
  missing.
- `grants[]`: each with `appId` or `principalId`, `grantedBy`, `at`.
- `createdBy, createdAt`: principal and timestamp.

## Rules

- Identity and config, credential, and grants are three separate things and
  never mix in one field.
- The credential is write-only: no verb returns it, and activity never records
  it.
- A grant lets its holder use the connection through the cloud; it never lets
  them read the credential.
- Removing a connection revokes all grants and destroys the credential in the
  same operation.

## Owns

- [credentials](credentials/AGENTS.md): the secret material, write-only.

## Use cases

### `create.ts`

Registers a connection without a credential.

- Validation: `config` carries no field the service marks as secret; such a
  field is rejected.
- Side effect: one [activity](../activity/AGENTS.md) entry with the actor, the
  connection, and the outcome.

### `get.ts`

Reads one connection without its credential.

### `list.ts`

Lists the connections of an organization, paged.

### `remove.ts`

Removes a connection with its grants and credential.

- Grants are revoked and the credential destroyed in the same request; there
  is no half-removed connection.
- Side effect: one [activity](../activity/AGENTS.md) entry with the actor, the
  connection and the grants revoked, and the outcome.

### `grant.ts`

Adds a grant of use to a connection.

- Granting to a principal that is an agent requires the agent's delegating
  human to hold the same grant, or the grant is refused.
- A duplicate grant changes nothing and returns the connection as it is.
- Side effect: one [activity](../activity/AGENTS.md) entry with the actor, the
  connection and the grantee, and the outcome.

### `revoke.ts`

Removes a grant of use from a connection.

- Revoking a grant that does not exist changes nothing and returns the
  connection as it is.
- Side effect: one [activity](../activity/AGENTS.md) entry with the actor, the
  connection and the former grantee, and the outcome.

## Infrastructure (`infrastructure.ts`)

Interfaces this module requires. Implemented in
[infrastructure](../../../../infrastructure/AGENTS.md), never here; injected
into use cases by api and worker; spoken in this module's own types.

Persistence:

- `connections`: save, load by id or by organization and name, list by
  organization and service, update grants and credential status.

Providers:

- `secrets vault`: store secret material by reference, replace it atomically,
  hand it to the cloud only at the moment of use, destroy it.

## Exposure

Exposed through `POST /connections`, `GET /connections/:id`, `GET
/connections`, `DELETE /connections/:id`, `POST /connections/:id/grants`,
`DELETE /connections/:id/grants/:granteeId`. Contracts:
[/connections](../../api/connections/AGENTS.md),
[/connections/:id](../../api/connections/[id]/AGENTS.md),
[/connections/:id/grants](../../api/connections/[id]/grants/AGENTS.md),
[/connections/:id/grants/:granteeId](../../api/connections/[id]/grants/[granteeId]/AGENTS.md).
