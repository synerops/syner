# compute

Owns environments and executions: where code runs and each run of it.

## Things

- [environments](environments/AGENTS.md): where code runs: an isolated runtime
  with a lifetime.
- [executions](executions/AGENTS.md): one run of a command inside an
  environment, with its result.

## Rules

- An execution belongs to exactly one environment.
- Environment allocation may be implicit: starting an execution without an
  environment allocates one for it.
- An execution is not a job run and not an operation; the three stay distinct.
- Consumption of environments and executions is recorded in
  [usage](../usage/AGENTS.md).

## Needs from infrastructure

[ports](ports/AGENTS.md): persistence for environments and executions; a
runtime provider that allocates environments and runs commands in them.
