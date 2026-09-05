<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">environments</h1>

<p align="center">
  <strong>An isolated runtime with resources and a lifetime.</strong>
</p>

An environment is a place to run code: a runtime, a slice of CPU and memory,
and a clock. It is ephemeral by default, created for some work and stopped
after, and it can be kept alive when an agent needs continuity between
executions.

## What an environment looks like

- **Runtime.** what runs inside: a named runtime the cloud offers.
- **Resources.** CPU and memory.
- **Status.** pending, ready, or stopped.
- **Lifetime.** ephemeral, or kept alive until removed.
- **Organization.** the owner.

## What you can do with it

| Verb | Who | What happens |
|---|---|---|
| [create](create/README.md) | an agent or a member with compute rights | allocates an environment |
| [get](get/README.md) | anyone who can read it | returns the environment and its status |
| [list](list/README.md) | anyone who can read the organization | returns the organization's environments |
| [remove](remove/README.md) | the owner or an agent with compute rights | stops and releases it |

## How it relates to the rest

[Executions](../executions/README.md) run inside an environment. Creating and
removing are long-running, tracked in [ops](../../ops/README.md). Time alive
is metered in [usage](../../usage/README.md).
