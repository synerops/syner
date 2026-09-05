# worker

The receiver of Syner's own jobs. Two kinds of delivery arrive here, each
as a signed HTTP call with an idempotency key: the cloud's administration
operations (deploy, roll back, remove, provision) and the customers' runs
when a trigger fires. For each, it verifies the signature, checks the
idempotency key against what it already processed, calls the use case in
@syner/cloud with the adapters from @syner/infrastructure, and reports.
Administrative work reports progress and outcome through
[lib/operations](../../packages/cloud/src/lib/operations/AGENTS.md); a
customer's run reports through its own attempts and events in
[lib/jobs/runs](../../packages/cloud/src/lib/jobs/runs/AGENTS.md). The two
never mix.

Startup and recovery: the platform's release starts the worker and keeps it
up; no trigger does. While it is down, the delivery provider holds every
run durably and retries with backoff; on return, redeliveries with a key
already processed are acknowledged without work. Business policies stay in
cloud. The delivery provider is open.
