# budgets

Owns budgets: limits on usage per scope and period, with an action on reach.

## Model (`budget.ts`)

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

## Use cases

### `set.ts`

Creates or replaces the budget of a scope.

- A cost limit is rejected when no pricing provider is configured.
- Side effect: one [activity](../../activity/AGENTS.md) entry with the actor,
  the scope and the limit, and the outcome.

### `get.ts`

Reads the budget of a scope with its consumption in the current period.

## Exposure

Public location pending for `set`, `get`: see [api](../../../api/AGENTS.md).
Nothing under `api/` exists for it yet.
