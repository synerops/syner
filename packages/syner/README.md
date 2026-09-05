<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">syner</h1>

<p align="center">
  <strong>The Syner agent, on your machine and in the cloud.</strong>
</p>

It runs on your machine as the `syner` CLI and hosted as Syner Bot at syner.bot,
with one behavior in both places: it reaches the Syner cloud through
`@syner/sdk` with your identity, and it operates Syner OS for you.

<!-- prettier-ignore -->
> [!NOTE]
> This package is being rewritten. The commands below are the target.

## Usage

```sh
bunx syner apps create
```

Commands read `syner <resource> <verb>`. Resources are the cloud's
capabilities and controls: `apps`, `compute`, `storage`, `connections`,
`jobs`, and the controls behind Syner OS. Every command returns a
structured result and supports a non-interactive mode, so an agent can
drive it as well as you can.
