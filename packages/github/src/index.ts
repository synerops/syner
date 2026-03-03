#!/usr/bin/env bun
import { getToken } from "./lib/octokit.js";

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === "--help" || command === "-h") {
    console.log(`@syner/github - GitHub App token generator

Usage:
  bunx @syner/github create-app-token    Generate an installation access token

Environment variables required:
  GITHUB_APP_ID                 GitHub App ID
  GITHUB_APP_INSTALLATION_ID    Installation ID for the target org/user
  GITHUB_APP_PEM_PATH           Path to the private key PEM file

Example:
  bunx @syner/github create-app-token | gh auth login --with-token
`);
    process.exit(0);
  }

  if (command === "create-app-token") {
    const token = await getToken();
    console.log(token);
    process.exit(0);
  }

  console.error(`Unknown command: ${command}`);
  console.error("Run 'bunx @syner/github --help' for usage information.");
  process.exit(1);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
