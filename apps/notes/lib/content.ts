import { readFileSync, readdirSync, lstatSync } from "fs";
import { join, resolve } from "path";

const contentDir = resolve(process.cwd(), "content");

function isPathSafe(targetPath: string): boolean {
  const resolved = resolve(targetPath);

  if (!resolved.startsWith(contentDir + "/") && resolved !== contentDir) {
    return false;
  }

  try {
    const stat = lstatSync(resolved);
    if (stat.isSymbolicLink()) {
      return false;
    }
  } catch {
    return false;
  }

  return true;
}

export type ContentResult =
  | { type: "file"; content: string }
  | { type: "list"; items: { slug: string; title: string }[] }
  | null;

export function getContentTree(dir: string = contentDir): string[] {
  if (!isPathSafe(dir)) return [];

  const entries = readdirSync(dir, { withFileTypes: true });
  const paths: string[] = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (!isPathSafe(fullPath)) continue;

    if (entry.isDirectory()) {
      const indexPath = join(fullPath, "index.md");
      if (isPathSafe(indexPath)) {
        try {
          lstatSync(indexPath);
          paths.push(fullPath.replace(contentDir + "/", ""));
        } catch {}
      }
      paths.push(...getContentTree(fullPath));
    } else if (entry.name.endsWith(".md") && entry.name !== "index.md") {
      paths.push(fullPath.replace(contentDir + "/", "").replace(".md", ""));
    }
  }

  return paths;
}

function listDirectory(dir: string): { slug: string; title: string }[] {
  if (!isPathSafe(dir)) return [];

  const entries = readdirSync(dir, { withFileTypes: true });
  const items: { slug: string; title: string }[] = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (!isPathSafe(fullPath)) continue;

    if (entry.isDirectory()) {
      items.push({
        slug: entry.name,
        title: entry.name,
      });
    } else if (entry.name.endsWith(".md") && entry.name !== "index.md") {
      items.push({
        slug: entry.name.replace(".md", ""),
        title: entry.name.replace(".md", ""),
      });
    }
  }

  return items;
}

function tryLoadSlug(slugPath: string): ContentResult {
  const filePath = resolve(contentDir, `${slugPath}.md`);
  const dirPath = resolve(contentDir, slugPath);
  const indexPath = resolve(dirPath, "index.md");

  // Try file first (e.g., content/projects/common-stack.md)
  if (isPathSafe(filePath)) {
    try {
      const stat = lstatSync(filePath);
      if (stat.isFile()) {
        return { type: "file", content: readFileSync(filePath, "utf8") };
      }
    } catch {}
  }

  // Try directory with index.md
  if (isPathSafe(indexPath)) {
    try {
      const stat = lstatSync(indexPath);
      if (stat.isFile()) {
        return { type: "file", content: readFileSync(indexPath, "utf8") };
      }
    } catch {}
  }

  // Fallback: list directory contents
  if (isPathSafe(dirPath)) {
    try {
      const stat = lstatSync(dirPath);
      if (stat.isDirectory()) {
        const items = listDirectory(dirPath);
        if (items.length > 0) {
          return { type: "list", items };
        }
      }
    } catch {}
  }

  return null;
}

export function loadContent(slug?: string[]): ContentResult {
  // Root: list content directory
  if (!slug || slug.length === 0) {
    const items = listDirectory(contentDir);
    return { type: "list", items };
  }

  const originalPath = slug.join("/");

  // Try original slug first (handles folders like "syner.md")
  const result = tryLoadSlug(originalPath);
  if (result) return result;

  // Try normalized slug (strip .md from URL like "create-syner-app.md" → "create-syner-app")
  const lastSegment = slug[slug.length - 1];
  if (lastSegment.endsWith(".md")) {
    const normalizedPath = [...slug.slice(0, -1), lastSegment.slice(0, -3)].join("/");
    return tryLoadSlug(normalizedPath);
  }

  return null;
}
