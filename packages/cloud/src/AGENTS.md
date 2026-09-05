# src

The business modules of Syner. Every folder is a node; every node carries
`index.ts`, `README.md`, and `AGENTS.md`. Nothing lives outside a node.

## Kinds of node

- **module**: groups things (compute, storage, identity). `index` is the
  public door of the module. Children are things and `ports`.
- **thing**: something the cloud keeps (apps, versions, executions). Named
  in the plural. `index` holds the schema. Children are verbs and owned
  things.
- **verb**: one use case on the parent thing (create, rollback, evaluate).
  Named in the singular. `index` holds the use case.
- **ports**: one per module. `index` declares the interfaces the module
  needs from infrastructure.

When a module is a single thing, the module folder is the thing: apps,
connections, jobs, organizations, permissions, ops, usage, activity,
purpose.

## Verb vocabulary

One word, one meaning, everywhere: `create` brings a thing into existence;
`get` reads one; `list` reads a page; `update` changes a definition;
`remove` takes a thing away; `put` and `set` write whole values; `add` puts
a member in; `start` and `cancel` begin and stop long-running things;
`grant` and `revoke` give and take access; `authorize` decides; `record`
appends a fact; `declare` and `evaluate` belong to purpose; `rollback`
belongs to deployments.

## Rules that hold in every verb

- Authorization goes through [permissions/authorize](permissions/authorize/AGENTS.md),
  deny by default. The acting principal comes from the request context.
- Every mutation appends an [activity](activity/record/AGENTS.md) entry.
- A verb that outlives its request returns an [operation](ops/AGENTS.md)
  reference. Executions and job runs carry their own status instead.
- Consumption is recorded in [usage](usage/record/AGENTS.md) by the use case
  that caused it.
- Schemas and types live in the thing's `index`; verbs import them, never
  redefine them.
- Modules import each other only through their `index`.

## Modules

[apps](apps/AGENTS.md), [compute](compute/AGENTS.md),
[storage](storage/AGENTS.md), [connections](connections/AGENTS.md),
[jobs](jobs/AGENTS.md), [organizations](organizations/AGENTS.md),
[identity](identity/AGENTS.md), [permissions](permissions/AGENTS.md),
[ops](ops/AGENTS.md), [usage](usage/AGENTS.md),
[activity](activity/AGENTS.md), [purpose](purpose/AGENTS.md).
