# Apps

An app is a customer's product on Syner: a required HTTP backend and an
optional frontend, owned by an organization. This module owns app
identity, versions, and deployments. `syner apps create` is the first verb
of the cloud: it registers the app's identity in the organization; a
version and a deployment make it reachable. The other capabilities exist
without an app, and an app can use all of them.
