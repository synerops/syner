<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">create</h1>

<p align="center">
  <strong>Register a connection to an external service.</strong>
</p>

Name the service and give the non-secret settings. The credential comes
separately, through [credentials/set](../credentials/set/README.md), so the
secret never travels with the configuration.

## Example

```ts
const c = await syner.connections.create({
  organization: 'acme',
  name: 'stripe',
  service: 'stripe',
  config: { account: 'acct_123' },
})
```

In the CLI: `syner connections create stripe --service stripe --config
account=acct_123`.

## What happens next

Set the credential, then grant the connection to the app or agent that needs
it.
