# Syner

Syner is a Cloud for Agents. It gives agents five composable capabilities:
apps, compute, storage, connections, and jobs. Syner OS is the control
panel where the humans of an organization see what their agents did with
those capabilities and intervene. Syner is also an agent: the `syner`
package runs locally as a CLI and hosted as Syner Bot, and it operates
Syner OS on behalf of humans.

This repository is being rewritten on the retained Turborepo foundation:
apps/, packages/, and tooling/. The architectural reference is the nearest
AGENTS.md; the existing implementation is legacy until it is explicitly
migrated. Most TypeScript files are empty placeholders that fix a
boundary, not a behavior.

## Owners

- packages/cloud (@syner/cloud) owns the business: the five capabilities,
  the shared controls, and the interfaces infrastructure implements.
- packages/infrastructure implements persistence and provider interfaces.
- apps/api exposes the one public administration contract. apps/worker
  executes durable work. These two processes are the only importers of
  cloud and infrastructure.
- packages/sdk (@syner/sdk) is the typed mirror of the API. Every client
  reaches the cloud through it: Syner OS (apps/app), Syner Bot (apps/bot),
  the CLI, MCP, Terraform, and customer agents.
- packages/syner (syner) is the agent and its CLI. apps/web is the public
  site.

## Naming

Naming follows Vercel. The unscoped package is what people type: `syner`.
Everything else lives under @syner/*. Commands read
`syner <resource> <verb>`; the SDK reads `syner.<resource>.<verb>()`;
resources are the same nouns as the folders in packages/cloud/src.

## Open decisions

The API protocol and schema publication, the database, the cloud
providers, the queue, the authentication provider, and the agent framework
are open. Scaffolding keeps them open: a placeholder that implies one of
them is a bug.
