<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">budgets</h1>

<p align="center">
  <strong>A limit on consumption, and what happens when it is reached.</strong>
</p>

A budget says how much an organization or an app may consume of a metric, or
how much it may cost, per period. When it is reached, the budget's action
runs: notify the owners, or block new work of that kind until the period
turns.

## What a budget looks like

- **Scope.** the organization, or one app.
- **What.** a metric with a quantity, or cost in money.
- **Period.** day or month.
- **Action when reached.** notify, or block.
- **Current.** consumption so far in the period, read from usage.

## What you can do with it

| Verb | Who | What happens |
|---|---|---|
| [set](set/README.md) | an owner or admin | creates or replaces the budget for a scope |
| [get](get/README.md) | a member with usage rights | returns the budget with its current consumption |

## How it relates to the rest

Reads [usage](../README.md). A reached budget writes an
[activity](../../activity/README.md) entry and, when its action is block,
makes the relevant verbs refuse with `budget reached`.
