# /notes app improvements backlog

> Last reviewed: 2026-02-26 against codebase (backlog-triager v1.1)

## Status

| # | Item | Status | Priority |
|---|------|--------|----------|
| 1 | Dark mode support for the notes UI | Partial | P2 |
| 2 | Fix markdown rendering (images, syntax highlighting) | Open | P1 |
| 3 | Add search functionality to notes | Open | P1 |
| 4 | Migrate from `pages/` router to `app/` router | **Fixed** | - |
| 5 | Remove deprecated `lib/legacy-parser.ts` utility | **Fixed** | - |
| 6 | Performance: notes list loads slowly with 100+ files | Open | P2 |
| 7 | Update the note editor component styles | Open | P3 |
| 8 | Depends on #3 — add search keyboard shortcut (Cmd+K) | Open | P3 |

**Summary**: 2 fixed, 1 partial, 5 open.

## Prioritized next actions

1. **#2 Fix markdown rendering** — `react-markdown` v10.1.0 is installed but no remark/rehype plugins. Add `remark-gfm`, `rehype-highlight`, and image handling. Currently just `<ReactMarkdown>{content}</ReactMarkdown>` at `page.tsx:72`.
2. **#3 Add search** — No search exists. Consider Fuse.js for client-side or server-side indexing.
3. **#1 Dark mode** — Infrastructure exists (`darkMode: ["class"]`, CSS variables). Problem: inline styles at `page.tsx:15,20,24` (`style={{ color: "#666" }}`). Refactor to Tailwind classes.
4. **#6 Performance** — Defer until note collection grows. Consider ISR or pagination.
5. **#7 Editor styles** — Low priority, depends on #1.
6. **#8 Cmd+K shortcut** — Blocked by #3.

## Detail

### 1. Dark mode support — PARTIAL

The notes app should respect system preferences and allow manual toggle.

**Review note (2026-02-26)**: Infrastructure exists. `tailwind.config` has `darkMode: ["class"]`, `globals.css` defines dark CSS variables. Problem: `page.tsx` uses inline styles (`style={{ color: "#666" }}` at lines 15, 20, 24) bypassing the theme system. Fix: refactor to Tailwind classes.

### 2. Fix markdown rendering (merged #10) — OPEN

Images and code blocks don't render correctly.

**Review note (2026-02-26)**: `react-markdown` v10.1.0 installed but no plugins. Just `<ReactMarkdown>{content}</ReactMarkdown>` at line 72. Need to add:
- `remark-gfm` for GitHub-flavored markdown (tables, strikethrough)
- `rehype-highlight` or `rehype-prism` for syntax highlighting
- Image component for proper image handling

### 3. Add search functionality (merged #6) — OPEN

Full-text search across all notes. Consider Fuse.js for client-side fuzzy matching or server-side indexing.

**Review note (2026-02-26)**: No search exists. No Fuse.js. Only API is `app/api/markdown/[[...slug]]/route.ts` for raw markdown.

### 4. Migrate from pages to app router — FIXED

Already using `app/` router.

### 5. Remove deprecated legacy parser — FIXED

`lib/legacy-parser.ts` does not exist.

### 6. Performance with large note collections — OPEN

When 100+ files, list page loads slowly. Consider ISR or pagination.

### 7. Update editor styles — OPEN

Low priority. Wait for #1 (dark mode) first.

### 8. Search keyboard shortcut — BLOCKED

Blocked by #3. Add Cmd+K shortcut after search is implemented.
