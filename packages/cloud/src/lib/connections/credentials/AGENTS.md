# credentials

Owns the credential of a connection: write-only secret material.

## Model (`credential.ts`)

- `connectionId`: the connection.
- `setBy, setAt`: principal and timestamp.
- `fingerprint`: hash of the material; never the material itself.

## Rules

- The material is stored only in the secrets vault and referenced by the
  connection; the cloud's own persistence holds the fingerprint and
  timestamps.
- No verb, log, or activity entry ever contains the material.
- Setting replaces the previous material atomically; a failed set leaves the
  previous one in force.

## Use cases

### `set.ts`

Stores secret material for a connection, replacing any previous material.

- The material goes to the vault and nowhere else; the response never echoes
  it.
- Validation: the material has the shape the service expects; a wrong shape is
  rejected and nothing changes.
- Side effect: one [activity](../../activity/AGENTS.md) entry with the actor,
  the connection; the entry says a credential was set and by whom, nothing
  more, and the outcome.

## Exposure

Exposed through `PUT /connections/:id/credentials`. Contracts:
[/connections/:id/credentials](../../../api/connections/[id]/credentials/AGENTS.md).
