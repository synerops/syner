# CLI

The `syner` command for humans and agents. Agreed so far: `syner apps`
lists the apps running in the selected context (those whose current
deployment is live), `syner apps --all` lists every app with its status, and
`syner api <route>` sends an authenticated request to a route declared under
packages/cloud/src/api, the way `vercel api` does. The rest of the command
grammar is pending. Return structured results and actionable errors, and
support a non-interactive mode. The CLI calls the cloud through @syner/sdk;
privileged behavior stays on the server.
