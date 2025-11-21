# @syner/vercel Extension

## Purpose

Implements the Sandbox protocol using Vercel Sandbox. This is a vendor-specific extension that extends the vendor-agnostic protocol defined in `@syner/sdk`.

## Architecture

- **Protocol**: Uses `Sandbox` interface from `@syner/sdk`
- **Implementation**: Provides tools that work with sandbox instances from the environment
- **Sandbox Management**: `createSandbox` tool creates and stores sandbox in environment
- **Sandbox Operations**: `readFile` and `writeFiles` are part of the `Sandbox` protocol interface

## Structure

```
extensions/vercel/
├── src/
│   ├── index.ts           (exports)
│   └── system/
│       ├── env.ts         (createSandbox tool)
│       └── sandbox.ts     (future: readFile, writeFiles implementation)
```

## Implementation

### Sandbox Creation

- `createSandbox()` - Tool that creates a sandbox using Vercel Sandbox SDK and stores it in the environment
- `getSandbox()` - Function that retrieves the current sandbox from environment

### Sandbox Protocol Methods

The `Sandbox` interface defines:
- `readFile(path: string, signal?: AbortSignal) => Promise<null | ReadableStream>` - Reads a file from the sandbox
- `writeFiles(files: Array<{path: string, content: string}>, signal?: AbortSignal) => Promise<void>` - Writes multiple files to the sandbox

**Note**: The sandbox instance is obtained from the environment (`env.sandbox`). The sandbox must exist in the environment before operations can be performed. Implementations of these methods will be provided in vendor-specific extensions.

## Dependencies

- `@syner/sdk` - Protocol interface (peer dependency)
- `@vercel/sandbox` - Vercel Sandbox SDK

