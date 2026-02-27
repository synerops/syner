import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";
import { readFileSync } from "fs";

interface AppConfig {
  appId: string;
  installationId: number;
  privateKey: string;
}

function getConfig(): AppConfig {
  const appId = process.env.GITHUB_APP_ID;
  const installationId = process.env.GITHUB_APP_INSTALLATION_ID;
  const privateKey = process.env.GITHUB_APP_PRIVATE_KEY;
  const pemPath = process.env.GITHUB_APP_PEM_PATH;

  if (!appId || !installationId) {
    throw new Error(
      "Missing required environment variables: GITHUB_APP_ID or GITHUB_APP_INSTALLATION_ID"
    );
  }

  if (!privateKey && !pemPath) {
    throw new Error(
      "Missing private key: set GITHUB_APP_PRIVATE_KEY or GITHUB_APP_PEM_PATH"
    );
  }

  return {
    appId,
    installationId: parseInt(installationId, 10),
    privateKey: privateKey || readFileSync(pemPath!, "utf-8"),
  };
}

export async function getToken(): Promise<string> {
  const config = getConfig();

  const octokit = new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId: config.appId,
      privateKey: config.privateKey,
      installationId: config.installationId,
    },
  });

  const auth = await octokit.auth({ type: "installation" }) as { token: string };
  return auth.token;
}

export function createOctokit(): Octokit {
  const config = getConfig();

  return new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId: config.appId,
      privateKey: config.privateKey,
      installationId: config.installationId,
    },
  });
}
