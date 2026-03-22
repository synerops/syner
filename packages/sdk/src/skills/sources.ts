/** Directories where skills are discovered, relative to project root */
export const SKILL_SOURCES = [
  'skills/syner',
  'apps/vaults/skills',
  'apps/dev/skills',
  'apps/bot/skills',
  'packages/github/skills',
] as const

/** Category mapping based on source path */
export const CATEGORY_MAP: Record<string, string> = {
  'skills/syner': 'Orchestration',
  'apps/vaults/skills': 'Vaults',
  'apps/dev/skills': 'Dev',
  'apps/bot/skills': 'Bot',
  'packages/github/skills': 'Auth',
}
