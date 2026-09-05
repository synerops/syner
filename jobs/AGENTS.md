# Syner's own jobs

Syner is its first customer and uses its own concepts. `apps/` holds the
apps Syner runs on itself; `jobs/` holds the jobs. A job is durable work with
triggers and runs, as [lib/jobs](../packages/cloud/src/lib/jobs/AGENTS.md)
defines it; it is not an HTTP app.

worker/ is the job that executes the cloud's long-running operations and the
customers' job runs. Like every job, it composes @syner/cloud with
@syner/infrastructure and never carries business rules of its own. A job
here is defined, versioned, and run through the same capability a
customer's job uses.

The workspace manifest does not list `jobs/*` yet; that change belongs with
the manifests, outside this scaffold.
