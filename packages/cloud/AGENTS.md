# @syner/cloud

The business of Syner. src/ holds the five capabilities, the shared
controls, and the persistence and provider interfaces they require.
apps/api and apps/worker call these use cases; clients reach them through
the API.

Enforce business authorization inside use cases, so every entry point
behaves the same. Define required interfaces here and leave
implementations to packages/infrastructure. Keep input and output schemas
and internal types with the concept that owns them. src/index.ts exports
only intentional public interfaces.
