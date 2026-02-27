#!/usr/bin/env bun
import { getToken } from "./lib/octokit.js";
import { spawn } from "child_process";

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === "--help" || command === "-h") {
    console.log(`syner-agent-github - GitHub App authentication for synerbot

Usage:
  syner-agent-github token              Get a valid installation access token
  syner-agent-github exec -- <cmd>      Execute command with GH_TOKEN injected

Environment variables required:
  GITHUB_APP_ID                 GitHub App ID
  GITHUB_APP_INSTALLATION_ID    Installation ID for the target org/user
  GITHUB_APP_PEM_PATH           Path to the private key PEM file

Examples:
  syner-agent-github token
  syner-agent-github exec -- gh api /user
  syner-agent-github exec -- gh issue create --title "Bug" --body "Description"
`);
    process.exit(0);
  }

  if (command === "token") {
    const token = await getToken();
    console.log(token);
    process.exit(0);
  }

  if (command === "exec") {
    const dashDashIndex = args.indexOf("--");
    if (dashDashIndex === -1 || dashDashIndex === args.length - 1) {
      console.error("Usage: syner-agent-github exec -- <command> [args...]");
      process.exit(1);
    }

    const execArgs = args.slice(dashDashIndex + 1);
    const execCommand = execArgs[0];
    const execCommandArgs = execArgs.slice(1);

    const token = await getToken();

    const child = spawn(execCommand, execCommandArgs, {
      stdio: "inherit",
      env: {
        ...process.env,
        GH_TOKEN: token,
        GITHUB_TOKEN: token,
      },
    });

    child.on("error", (err) => {
      console.error(`Failed to execute command: ${err.message}`);
      process.exit(1);
    });

    child.on("exit", (code) => {
      process.exit(code ?? 0);
    });

    return;
  }

  console.error(`Unknown command: ${command}`);
  console.error("Run 'syner-agent-github --help' for usage information.");
  process.exit(1);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
