# Syner's own jobs

Syner is its first customer and uses its own concepts. `apps/` holds the
apps Syner runs on itself; `jobs/` holds the jobs. A job is a webhook, as
[lib/jobs](../packages/cloud/src/lib/jobs/AGENTS.md) defines it: an HTTP
target, the triggers that start a delivery, and a delivery policy with
signature, idempotency key, retries, backoff, timeout, and concurrency. A
run is one delivery with its attempts.

worker/ is the receiver of Syner's own jobs: the endpoint the cloud
delivers administrative work to. It is not started by a trigger. The
platform's own release starts it and keeps it running, like any always-on
receiver; the jobs that target it are defined by the cloud at boot, not
through the public API. If the worker is down, deliveries stay in the
durable queue and are retried with backoff; the idempotency key on every
delivery makes redelivery safe, so nothing runs twice and nothing is lost.
That is what makes it a job and not an app: it has no face and no traffic
of its own, only signed deliveries.

The workspace manifest does not list `jobs/*` yet; that change belongs with
the manifests, outside this scaffold.
