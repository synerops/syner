/**
 * Origin Allowlist for GitHub OAuth
 *
 * Security: Open redirect vulnerability prevention.
 * Only predefined Syner domains are allowed as redirect targets.
 *
 * Usage: ?origin=md (not ?origin=https://syner.md)
 */

const ALLOWED_ORIGINS = {
  app: 'https://syner.app',
  md: 'https://syner.md',
  bot: 'https://syner.bot',
  dev: 'https://syner.dev',
  design: 'https://syner.design',
} as const

export type OriginKey = keyof typeof ALLOWED_ORIGINS

/**
 * Resolves an origin key to its full URL.
 * Falls back to dev (syner.dev) for invalid/missing keys.
 *
 * @param key - Origin key (e.g., "md", "app", "bot")
 * @returns Full origin URL
 */
export function resolveOrigin(key: string | null | undefined): string {
  if (!key || !(key in ALLOWED_ORIGINS)) {
    return ALLOWED_ORIGINS.dev
  }
  return ALLOWED_ORIGINS[key as OriginKey]
}

/**
 * Validates if a key is a valid origin key.
 *
 * @param key - Origin key to validate
 * @returns True if key is valid
 */
export function isValidOriginKey(key: string | null | undefined): key is OriginKey {
  return !!key && key in ALLOWED_ORIGINS
}

/**
 * Returns all valid origin keys.
 */
export function getOriginKeys(): OriginKey[] {
  return Object.keys(ALLOWED_ORIGINS) as OriginKey[]
}
