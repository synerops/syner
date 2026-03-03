import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";
import { throttling } from "@octokit/plugin-throttling";
import { readFileSync } from "fs";

// Create throttled Octokit class
const ThrottledOctokit = Octokit.plugin(throttling);

interface AppConfig {
  appId: string;
  installationId: number;
  privateKey: string;
}

export interface ThrottlingCallbacks {
  /** Called when primary rate limit is hit */
  onRateLimit?: (retryAfter: number, retryCount: number) => void;
  /** Called when secondary (abuse) rate limit is hit */
  onSecondaryRateLimit?: (retryAfter: number) => void;
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

  const auth = (await octokit.auth({ type: "installation" })) as {
    token: string;
  };
  return auth.token;
}

/**
 * Creates an Octokit instance without throttling (backward compatible).
 */
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

/**
 * Creates an Octokit instance with rate limit throttling.
 *
 * Uses @octokit/plugin-throttling to handle:
 * - Primary rate limit (5000 req/hour for authenticated requests)
 * - Secondary rate limit (abuse detection)
 *
 * @param callbacks - Optional callbacks for rate limit events
 * @returns Throttled Octokit instance
 *
 * @example
 * ```ts
 * const octokit = createThrottledOctokit({
 *   onRateLimit: (retryAfter, count) => {
 *     console.log(`Rate limit hit, retry #${count + 1} after ${retryAfter}s`)
 *   },
 * })
 * ```
 */
export function createThrottledOctokit(callbacks?: ThrottlingCallbacks): Octokit {
  const config = getConfig();
  const { onRateLimit, onSecondaryRateLimit } = callbacks || {};

  return new ThrottledOctokit({
    authStrategy: createAppAuth,
    auth: {
      appId: config.appId,
      privateKey: config.privateKey,
      installationId: config.installationId,
    },
    throttle: {
      onRateLimit: (retryAfter, opts, octokit, retryCount) => {
        onRateLimit?.(retryAfter, retryCount);
        octokit.log.warn(
          `Rate limit hit for ${opts.method} ${opts.url}, retry #${retryCount + 1} after ${retryAfter}s`
        );
        // Retry up to 2 times
        return retryCount < 2;
      },
      onSecondaryRateLimit: (retryAfter, opts, octokit) => {
        onSecondaryRateLimit?.(retryAfter);
        octokit.log.warn(
          `Secondary rate limit for ${opts.method} ${opts.url}, retry after ${retryAfter}s`
        );
        return true;
      },
    },
  }) as Octokit;
}
