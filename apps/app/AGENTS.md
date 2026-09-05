# Syner OS

The control panel at syner.app. It answers five questions for the humans
of an organization about their apps, each backed by controls in
@syner/cloud:

- Is it working? Deployments say what is live; operations say how
  administration is progressing. Runtime health has no evidence source yet.
- What changed? Activity and versions.
- What is it costing? Usage and budgets.
- Who has access? Identity, permissions, members, and connection grants.
- Is it fulfilling its purpose? The app's spec carries its purpose; measuring
  it is not agreed.

Syner OS is a client: it consumes the administration API through
@syner/sdk and renders with @syner/ui. It is the base app from which other
apps are created. Humans and Syner Bot operate it alike, so every action
in the interface is also a named operation an agent can invoke.
