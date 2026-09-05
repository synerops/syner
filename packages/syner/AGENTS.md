# syner

The Syner agent, published unscoped because it is what people type. One
agent, two runtimes with one behavior: locally as the CLI, hosted as Syner
Bot in apps/bot. It reaches the cloud through @syner/sdk, carrying the
identity of the human it acts for, and stays free of @syner/cloud and
@syner/infrastructure.

src/cli/ is the command surface. brain.ts, prompts/, tools/, and intent/
are the seed of the agent, inherited from the orchestrator direction:
rewrite them in place toward operating Syner OS. The agent framework is
open.
