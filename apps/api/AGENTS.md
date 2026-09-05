# Administration API

Expose one coherent public administration contract to Syner OS, Syner
Bot, the SDK, the CLI, MCP, and future clients such as Terraform.
Authenticate each request, resolve the actor and the organization, and
invoke @syner/cloud use cases with that context. Business authorization
happens in cloud, so every entry point behaves the same.

Long-running calls return an operation reference. Customer application
traffic is served elsewhere. The transport, framework, and schema
publication strategy are open; Vercel's pattern, a published OpenAPI
contract with an SDK generated from it, is the reference, not a decision.
