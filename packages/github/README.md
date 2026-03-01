# @syner/github

GitHub App authentication for syner agents. Generates installation access tokens for the `gh` CLI.

## Usage

Use `gh` directly. If authentication fails, generate a token:

```bash
bunx @syner/github create-app-token | gh auth login --with-token
```

Then retry your `gh` command.

### Examples

```bash
# Authenticate once per session
bunx @syner/github create-app-token | gh auth login --with-token

# Then use gh normally
gh issue create --title "Bug" --body "Description"
gh pr create --title "Feature" --body "Changes"
gh api /user
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
