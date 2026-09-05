# Administration API

Expose one coherent public administration contract to Syner OS, Syner
Bot, the SDK, the CLI, MCP, and future clients such as Terraform.
Authenticate each request, resolve the actor and the organization, and
invoke @syner/cloud use cases with that context. Business authorization
happens in cloud, so every entry point behaves the same.

The routes it serves are declared by file-based routing under
packages/cloud/src/api; this process discovers and mounts them. That
mechanism is not implemented and not chosen. The transport is HTTP, with
the methods each route documents; long-running calls answer `202` with an
operation reference. Customer application traffic is served elsewhere. The
framework and the schema publication strategy are open; Vercel's pattern, a
published OpenAPI contract with an SDK generated from it, is the reference,
not a decision.
