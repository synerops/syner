# @syner/cloud

The business of Syner. `src/` holds the five capabilities, the seven
controls, and, in each module's `ports`, the interfaces infrastructure
implements. `apps/api` and `apps/worker` call these use cases; clients reach
them through the API.

The hierarchy, the verb vocabulary, and the rules every verb obeys are in
[src/AGENTS.md](src/AGENTS.md). Each node below it carries its own contract.

Business authorization happens inside use cases, so every entry point
behaves the same. Interfaces are declared here and implemented in
`packages/infrastructure`. `src/index.ts` exports only intentional public
interfaces.
