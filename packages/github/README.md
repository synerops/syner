# @syner/github

GitHub App authentication package for syner agents. Provides secure token management for automated GitHub operations.

## Overview

This package wraps [@octokit/auth-app](https://github.com/octokit/auth-app.js) to generate installation access tokens for GitHub App authentication. It enables syner agents to interact with GitHub without using personal access tokens.

## Installation

```bash
bun add @syner/github
```

## Usage

### CLI

The package provides a CLI tool `syner-agent-github` with two commands:

#### Get Token

```bash
syner-agent-github token
```

Returns a valid installation access token to stdout.

#### Execute Command with Token

```bash
syner-agent-github exec -- <command> [args...]
```

Runs any command with `GH_TOKEN` and `GITHUB_TOKEN` injected into the environment.

**Examples:**

```bash
# Get authenticated user info
syner-agent-github exec -- gh api /user

# Create an issue
syner-agent-github exec -- gh issue create --title "Bug" --body "Description"

# Create a pull request
syner-agent-github exec -- gh pr create --title "Feature" --body "Changes"
```

### Programmatic

```typescript
import { getToken, createOctokit } from "@syner/github";

// Get a raw token
const token = await getToken();

// Or get a pre-configured Octokit instance
const octokit = createOctokit();
const { data: user } = await octokit.users.getAuthenticated();
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GITHUB_APP_ID` | Yes | The GitHub App ID |
| `GITHUB_APP_INSTALLATION_ID` | Yes | Installation ID for the target org/user |
| `GITHUB_APP_PRIVATE_KEY` | One of these | The private key contents (PEM format) |
| `GITHUB_APP_PEM_PATH` | One of these | Path to the private key file |

## Setup

1. Install the GitHub App on your org/profile
2. Get your `GITHUB_APP_INSTALLATION_ID` from the URL after installation:
   ```
   https://github.com/settings/installations/12345678
                                              ^^^^^^^^
                                              this is your installation ID
   ```
3. Configure the environment variables

## Why GitHub App Auth?

- **Security**: No personal access tokens stored or exposed
- **Scoped permissions**: Apps have fine-grained permissions per installation
- **Audit trail**: Actions are attributed to the app, not a user
- **Rate limits**: App installations have higher rate limits

## Development

```bash
# Install dependencies
bun install

# Type check
bun run typecheck

# Build
bun run build

# Run locally (from monorepo root)
bun run agent-github token
bun run agent-github exec -- gh api /user
```

## Integration with Syner

This package is used by skills and agents that need GitHub access:

- **syner-worker**: Uses `gh` CLI for GitHub operations (issues, PRs)
- **Skills**: Can delegate GitHub tasks to syner-worker

When `gh` CLI is used within syner, prefer running it through this package to ensure proper authentication:

```bash
bun run agent-github exec -- gh <command>
```
