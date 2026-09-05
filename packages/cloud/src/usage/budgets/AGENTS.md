# budgets

Owns budgets: limits on usage per scope and period, with an action on reach.

## Schema (index)

- `scope`: `organizationId` and optional `appId`.
- `limit`: `metric` and `quantity`, or `cost` and `currency`.
- `period`: `day` or `month`.
- `action`: `notify` or `block`.
- `setBy, setAt`: principal and timestamp.

## Rules

- One budget per scope and limit kind; set replaces it.
- A cost budget requires a pricing provider; without one, set is rejected.
- `block` refuses new consumption of the metric in scope; it never stops what
  is already running.
- The period turns on UTC boundaries.

## Verbs

- [set](set/AGENTS.md): creates or replaces the budget for a scope
- [get](get/AGENTS.md): returns the budget with its current consumption
