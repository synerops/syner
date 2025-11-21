# @syner/vercel Extension

## Purpose

Implements the Sandbox protocol using Vercel Sandbox. This is a vendor-specific extension that extends the vendor-agnostic protocol defined in `@syner/sdk`.

## Architecture

- **Sandbox Protocol**: Uses `Sandbox` interface from `@syner/sdk/system/env/sandbox` (container management)
- **Filesystem Protocol**: Defines `Filesystem` interface with file operations (`readFile`, `writeFiles`)
- **Implementation**: Provides tools that work with sandbox instances from the environment
- **Sandbox Management**: `createSandbox` tool creates and stores sandbox in environment
- **Filesystem Operations**: `readFile` and `writeFiles` are defined in the `Filesystem` interface

## Structure

```
extensions/vercel/
├── src/
│   ├── index.ts           (exports)
│   └── system/
│       ├── env.ts         (createSandbox tool)
│       └── fs.ts          (Filesystem interface: readFile, writeFiles)
```

## Implementation

### Sandbox Creation

- `createSandbox()` - Tool that creates a sandbox using Vercel Sandbox SDK and stores it in the environment
- `getSandbox()` - Function that retrieves the current sandbox from environment

### Filesystem Protocol Methods

The `Filesystem` interface (defined in `fs.ts`) provides:
- `readFile(path: string, signal?: AbortSignal) => Promise<null | ReadableStream>` - Reads a file from the filesystem
- `writeFiles(files: Array<{path: string, content: string}>, signal?: AbortSignal) => Promise<void>` - Writes multiple files to the filesystem

**Note**: The `Sandbox` interface (from `@syner/sdk/system/env/sandbox`) manages container properties (id, status, timeout). File operations are separate and defined in the `Filesystem` interface. The sandbox instance is obtained from the environment (`env.sandbox`). The sandbox must exist in the environment before filesystem operations can be performed.

## Dependencies

- `@syner/sdk` - Protocol interface (peer dependency)
- `@vercel/sandbox` - Vercel Sandbox SDK

