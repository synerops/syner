<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">@syner/sdk</h1>

<p align="center">
  <strong>The typed client of the Syner API.</strong>
</p>

Every client of the cloud goes through it: Syner OS, Syner Bot, the CLI, the MCP
server, and your own agents.

<!-- prettier-ignore -->
> [!NOTE]
> This package is being rewritten. The shape below is the target.

## Usage

```ts
import { Syner } from '@syner/sdk'

const syner = new Syner()
const operation = await syner.apps.create({ name: 'billing' })
```

The client exposes one namespace per API resource, mirroring the cloud:
`syner.apps`, `syner.compute`, `syner.storage`, `syner.connections`,
`syner.jobs`, and the shared controls. Results and errors are typed, and
long-running calls return an operation you can follow.
