# Plan 02: Storage interface + adapters

## Objetivo

Crear la interface `Storage` en `@syner/sdk` y los adapters en sus respectivos packages. Esta interface es el contrato que syner.md implementa internamente.

## Package distribution

```
@syner/sdk (packages/sdk)       → Storage interface, GrepMatch, tipos compartidos
packages/syner                  → createLocalStorage (filesystem, solo dev)
packages/github                 → createGitHubStorage (Contents + Trees + Search API)
```

## Interface (`@syner/sdk`)

```typescript
export interface Storage {
  // CRUD
  read(path: string): Promise<string | null>
  write(path: string, content: string, message?: string): Promise<void>
  delete(path: string, message?: string): Promise<void>
  exists(path: string): Promise<boolean>

  // Discovery
  glob(pattern: string): Promise<string[]>
  grep(pattern: string, globPattern?: string): Promise<GrepMatch[]>
  tree(prefix?: string): Promise<string[]>
}

export interface GrepMatch {
  path: string
  line: number
  text: string
}
```

## Adapters

### GitHubStorage (`packages/github`)

Usa tres APIs de GitHub:

| Método Storage | GitHub API | Endpoint |
|---------------|------------|----------|
| `read` | Contents API | `GET /repos/{owner}/{repo}/contents/{path}` |
| `write` | Contents API | `PUT /repos/{owner}/{repo}/contents/{path}` |
| `delete` | Contents API | `DELETE /repos/{owner}/{repo}/contents/{path}` |
| `exists` | Contents API | `GET /repos/{owner}/{repo}/contents/{path}` (check 404) |
| `glob` | Trees API | `GET /repos/{owner}/{repo}/git/trees/{branch}?recursive=1` + filter |
| `tree` | Trees API | `GET /repos/{owner}/{repo}/git/trees/{branch}?recursive=1` + prefix |
| `grep` | Search API | `GET /search/code?q={query}+repo:{owner}/{repo}` |

### LocalStorage (`packages/syner`)

Para desarrollo local de syner.md únicamente:

| Método Storage | Implementación |
|---------------|----------------|
| `read` | `fs.readFile` |
| `write` | `fs.writeFile` |
| `delete` | `fs.unlink` |
| `exists` | `fs.stat` |
| `glob` | `fast-glob` o `fs.readdir` recursivo + filter |
| `tree` | `fs.readdir` recursivo |
| `grep` | Leer archivos + regex match |

## File structure

```
packages/sdk/
  src/
    storage.ts              # Storage interface, GrepMatch
    index.ts                # Re-exports

packages/github/
  src/
    storage.ts              # createGitHubStorage
    index.ts                # Re-export storage + existing exports

packages/syner/
  src/
    storage/
      local.ts              # createLocalStorage
      index.ts              # Re-export
```

## Definición de Done

- [ ] `@syner/sdk` package creado con `Storage` interface
- [ ] `createGitHubStorage` en `packages/github` usando Contents + Trees + Search API
- [ ] `createLocalStorage` en `packages/syner`
- [ ] Tests para ambos adapters contra `synerops/os`
- [ ] Puede read, write, glob, grep, tree

## Riesgos

- **GitHub Search API delay**: El indexing tiene delay — archivos recién escritos pueden no aparecer en grep inmediatamente. Mitigación: cache en syner.md con TTL corto.
- **Trees API size**: Si el repo crece mucho, la response del tree puede ser grande. Mitigación: el repo es markdown — el tree será pequeño por mucho tiempo.
- **Rate limits**: Search API tiene 30 req/min. Mitigación: uso es bajo (humano + bot), cache en syner.md absorbe repeticiones.
