# Syner's own apps

Syner is its first customer and uses its own concepts. Every folder here is
an app in the sense [lib/apps](../packages/cloud/src/lib/apps/AGENTS.md)
defines: an HTTP backend with an optional frontend, versioned and deployed
like a customer's. Durable work is not an app; it lives in
[jobs/](../jobs/AGENTS.md).

api/ is the administration API. app/ is Syner OS at syner.app. bot/ is Syner
Bot at syner.bot. web/ is the public site.

api/ composes @syner/cloud with @syner/infrastructure. app/, bot/, and web/
are clients and reach the cloud through @syner/sdk only. An app composes;
business rules live in cloud. Customer app traffic is separate from the
administration API.
