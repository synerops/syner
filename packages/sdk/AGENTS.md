# @syner/sdk

The typed client of the administration API, and the path every client
takes to the cloud. Expose one namespace per API resource, mirroring the
capabilities and controls in packages/cloud/src: `syner.apps.create()`,
the way Vercel's SDK exposes `vercel.projects`. Return typed results,
typed errors, and operation references for long-running calls.

The client carries no business rules, no agent framework, and no server
dependencies. Whether it is generated from a published contract or
written by hand is open. The agent-runtime code under src/ (agents,
checks, context, runs, system, workflows) is legacy, not the template.
