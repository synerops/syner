# worker

Syner's own job: it executes what outlives a request. Two kinds of work
arrive here: the cloud's administration operations (deploy, roll back,
remove, provision) and the customers' job runs when their trigger fires.
For each, it calls the use case in @syner/cloud with the adapters from
@syner/infrastructure, and reports progress and outcome through
[lib/operations](../../packages/cloud/src/lib/operations/AGENTS.md) or the
run's own events.

It is a job, not an app: no HTTP surface, no frontend. Its triggers are the
queue the cloud feeds and the schedules the cloud registers; the queue
provider is open. Business policies stay in cloud.
