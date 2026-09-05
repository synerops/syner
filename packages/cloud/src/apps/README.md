<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">apps</h1>

<p align="center">
  <strong>A customer's product on Syner: an HTTP backend and an optional frontend.</strong>
</p>

An app is what your organization builds and runs on Syner: a service with an
HTTP backend and, when it has a face, a frontend. Creating an app registers
its identity in the organization. A version captures its code; a deployment
puts a version into service. Everything else in the cloud can exist without an
app, and an app can use all of it.

## What an app looks like

- **Name.** unique inside the organization; the handle you use in commands and
  URLs.
- **Organization.** the owner. An app belongs to exactly one.
- **Backend.** the HTTP service: its runtime, its entry point, and the
  environment it expects.
- **Frontend.** optional. Static files or a server-rendered face for the
  backend.
- **Current deployment.** the one serving traffic right now, or none yet.
- **Created by, since.** who registered it and when.

## What it owns

- [versions](versions/README.md): immutable snapshots of the app's code and
  configuration.
- [deployments](deployments/README.md): a version put into service, with its
  status and URL.

## What you can do with it

| Verb | Who | What happens |
|---|---|---|
| [create](create/README.md) | a member of the organization | registers the app's identity; no version, no deployment yet |
| [get](get/README.md) | anyone who can read the app | returns the app with its current deployment |
| [list](list/README.md) | anyone who can read the organization | returns the organization's apps, paged |
| [update](update/README.md) | a member with update rights | changes name, backend, or frontend definition; applies at the next version |
| [remove](remove/README.md) | a member with remove rights | tears down the current deployment and releases the name |

## How it relates to the rest

Where an app's backend runs is decided per deployment, in
[deployments](deployments/README.md). [Jobs](../jobs/README.md) can target an
app. [Connections](../connections/README.md) are granted to an app so its
backend reaches external services. [Purpose](../purpose/README.md) is declared
per app. [Ops](../ops/README.md) tracks the long-running work: deploying,
rolling back, removing.
