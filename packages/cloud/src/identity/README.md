<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">identity</h1>

<p align="center">
  <strong>Who acts: humans, agents, services, and the delegations between them.</strong>
</p>

Every call into the cloud is made by someone. Identity says who: a human, an
agent, or a service. It also says on whose behalf: a delegation lets an agent
act with a human's identity and inside the human's limits, so that everything
the agent does is attributable and bounded. Identity represents who acts;
proving who they are is the job of an authentication provider that sits in
front of the API.

## What's inside

| Thing | What it is |
|---|---|
| [principals](principals/README.md) | the humans, agents, and services that can act. |
| [delegations](delegations/README.md) | a human letting an agent act for them, with scope and expiry. |

## How it relates to the rest

[Members](../organizations/members/README.md) are principals with a role.
[Permissions](../permissions/README.md) are granted to principals.
[Activity](../activity/README.md) records the principal and, when there is
one, the delegation behind each action.
