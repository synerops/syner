# @syner/cloud

The business of Syner. `src/` holds five library entries, the external
contract under `api/`, and the models, use cases, rules, and interfaces
under `lib/`. `apps/api` and `jobs/worker` call the use cases; clients reach
them through the API.

Spec first, code later: every `.ts` file is empty, and `index.ts` under
`api/` is the provisional marker of a route. The layers, the routing
convention, and the rules every use case obeys are in
[src/AGENTS.md](src/AGENTS.md). Each node below it carries its own guide.

Business authorization happens inside use cases, so every entry point behaves
the same. Interfaces are declared in each module's `infrastructure.ts` and
implemented in `packages/infrastructure`.
