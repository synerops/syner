# Deployable processes

One folder per process, one process per domain. api/ is the
administration API. worker/ executes durable platform work. app/ is Syner
OS at syner.app. bot/ is Syner Bot at syner.bot. web/ is the public site.

api/ and worker/ compose @syner/cloud with @syner/infrastructure. app/,
bot/, and web/ are clients and reach the cloud through @syner/sdk only.
A process composes; business rules live in cloud. Customer app traffic is
separate from the administration API.
