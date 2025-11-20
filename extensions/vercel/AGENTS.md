# @syner/vercel Extension

## Purpose

Implements the Sandbox protocol using Vercel Sandbox. This is a vendor-specific extension that extends the vendor-agnostic protocol defined in `@syner/sdk`.

## Architecture

- **Protocol**: Uses `Sandbox` interface from `@syner/sdk`
- **Implementation**: `VercelSandbox` class implements all protocol methods
- **Factory**: `createVercelSandbox()` creates configured instances

## Structure

```
extensions/vercel/
├── src/
│   ├── index.ts      (exports)
│   └── sandbox.ts    (implementation)
```

## Implementation

`VercelSandbox` implements:

- Core methods: `runCommand()`, `destroy()` - delegate to Vercel Sandbox
- Syner methods: `editFile()`, `readFile()`, `listFiles()`, `cloneRepo()`, `installDependencies()`
  - All implemented using `sandbox.runCommand()` internally

## Dependencies

- `@syner/sdk` - Protocol interface (peer dependency)
- `@vercel/sandbox` - Vercel Sandbox SDK

