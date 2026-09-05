# credentials

Owns the credential of a connection: write-only secret material.

## Schema (index)

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

## Verbs

- [set](set/AGENTS.md): stores new secret material, replacing the previous
