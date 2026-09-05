<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">versions</h1>

<p align="center">
  <strong>An immutable snapshot of an app's code and configuration.</strong>
</p>

A version is what an app looked like at one moment: its code, taken from a git
reference or an upload, and the backend and frontend definition in force when
it was captured. Versions are numbered per app and never change. Deployments
point at versions; a rollback is a deployment of an older one.

## What a version looks like

- **Number.** sequential per app: 1, 2, 3.
- **Source.** where the code came from: a git reference and commit, or an
  upload.
- **Definition.** the backend and frontend as they were when captured.
- **Created by, at.** who captured it and when.

## What you can do with it

| Verb | Who | What happens |
|---|---|---|
| [create](create/README.md) | a member with version rights, or the agent building the app | captures code and definition into a new number |
| [get](get/README.md) | anyone who can read the app | returns one version |
| [list](list/README.md) | anyone who can read the app | returns the app's versions, newest first |

## How it relates to the rest

[deployments](../deployments/README.md) put a version into service. The app's
current definition lives in [apps](../README.md); a version freezes a copy of
it.
