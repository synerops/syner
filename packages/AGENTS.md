# Packages

cloud/ (@syner/cloud) owns the business: capabilities, shared controls,
and the interfaces infrastructure implements. infrastructure/ implements
them, and only apps/api and apps/worker import it. sdk/ (@syner/sdk) is
the typed client of the API. syner/ (syner) is the agent and the CLI.
mcp/ (@syner/mcp) adapts the SDK for external agents. ui/ (@syner/ui) is
presentation.

Dependency direction: cloud imports nothing internal; infrastructure
imports cloud; sdk and ui import nothing internal; syner, mcp, and every
client app import sdk. Client packages stay free of server dependencies.
Package manifests, exports, and publication are outside this scaffold.
