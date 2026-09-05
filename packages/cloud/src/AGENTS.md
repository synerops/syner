# Business modules

One folder per module boundary, and boundaries only: these are modules of
one library, never separate services. Inside a folder, a noun file
(app.ts, deployment.ts) owns a concept with its schema and types; a verb
file (create.ts, rollback.ts) is one use case on that concept; a subfolder
(apps/versions) is a concept the parent owns that has a lifecycle of its
own; index.ts is the intentional public surface.

Capabilities are what agents consume: apps, compute, storage, connections,
jobs. Controls are what makes it safe and visible for an agent to act on
behalf of a human, and what Syner OS reads to answer its five questions:
organizations, identity, permissions, operations, usage, activity,
purpose.

Three concepts stay distinct: an execution runs code in compute; a job run
is one occurrence of a defined job; an operation tracks a long-running
administration action.
