# Syner Bot

The hosted Syner agent at syner.bot. It runs the agent from the `syner`
package, meets humans in messaging channels, and operates Syner OS on
their behalf. It is the first client of the cloud and takes the same path
as any client: @syner/sdk, with the delegated identity of the human it
acts for.

Channel adapters live here; the agent's behavior lives in packages/syner.
The first channel and the channel framework are open.
