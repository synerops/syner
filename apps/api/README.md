<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">api</h1>

<p align="center">
  <strong>The Syner administration API.</strong>
</p>

The one public contract every client uses: Syner OS, Syner Bot, the CLI, the MCP
server, and your own agents through `@syner/sdk`. It authenticates each request,
resolves who is acting and for which organization, and calls `@syner/cloud`.

<!-- prettier-ignore -->
> [!NOTE]
> This process is a scaffold. The transport and the way the contract is
> published aren't decided yet.
