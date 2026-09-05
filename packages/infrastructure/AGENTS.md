# @syner/infrastructure

Implementations of the persistence and provider interfaces that
@syner/cloud defines. apps/api and jobs/worker are its only importers.
Provider credentials and provider-specific types stay here, on the
server; business decisions stay in cloud. The database and the cloud
providers are open.
