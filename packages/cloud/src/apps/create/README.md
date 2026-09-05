<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">create</h1>

<p align="center">
  <strong>Register a new app in an organization.</strong>
</p>

This is the first verb of the cloud. It gives the app an identity: a name
inside your organization and a definition of its backend. Nothing runs yet.
The app becomes reachable when a version is created and deployed.

## Example

```ts
const app = await syner.apps.create({
  organization: 'acme',
  name: 'billing',
  backend: { runtime: 'node', entry: 'src/server.ts', env: ['STRIPE_KEY'] },
})
```

The same call exists as `syner apps create billing` in the CLI.

## What happens next

You get the app back with no deployment. Next:
[versions/create](../versions/create/README.md) to capture its code, then
[deployments/create](../deployments/create/README.md) to put it into service.
