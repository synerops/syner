<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">activity</h1>

<p align="center">
  <strong>The history of who did what.</strong>
</p>

Every action in the cloud leaves an entry: who did it, on what, with what
outcome, and, when an agent acted for a human, the delegation behind it.
Activity is how an organization answers "what changed?" and how it tells apart
what a person did, what Syner Bot did, and what a customer's own agent did.

## What an activity entry looks like

- **Actor.** the principal, and the delegation chain when an agent acted for a
  human.
- **Action.** the verb, named as in the tree: `apps/deployments/create`.
- **Resource.** what it was done to.
- **Outcome.** succeeded, failed, or denied.
- **Details.** what changed, as a short before and after, or the reason for a
  failure or denial.
- **When.** timestamp.

## What you can do with it

| Verb | Who | What happens |
|---|---|---|
| [record](record/README.md) | the cloud itself, from every use case | appends an entry |
| [list](list/README.md) | a member with activity rights | returns entries by organization, resource, actor, or window |

## How it relates to the rest

Every verb in every module records here. [Ops](../ops/README.md) records when
an operation ends. [Permissions/authorize](../permissions/authorize/README.md)
records denials. [Purpose/evaluate](../purpose/evaluate/README.md) reads
activity as evidence. Credentials never appear here.
