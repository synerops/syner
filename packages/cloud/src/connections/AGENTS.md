# connections

Owns connections: visible configuration, a write-only credential, and grants
of use.

## Schema (index)

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

## Verbs

- [create](create/AGENTS.md): registers the connection without a credential
- [get](get/AGENTS.md): returns the connection, never the secret
- [list](list/AGENTS.md): returns the organization's connections
- [remove](remove/AGENTS.md): revokes every grant, destroys the credential,
  removes the connection
- [grant](grant/AGENTS.md): lets an app or a principal use it
- [revoke](revoke/AGENTS.md): takes that use away

## Needs from infrastructure

[ports](ports/AGENTS.md): persistence for connections; a secrets vault that
stores credential material by reference.
