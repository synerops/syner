# Syner

> The Orchestrator Agent - opinionated defaults built on [@syner/sdk](../sdk)

Syner provides batteries-included implementations of the SDK primitives with smart defaults, pre-configured guidelines, and production-ready integrations.

## Usage

```bash
bunx syner
```

## Installation (to interact with syner APIs such as registry, apps)

```bash
bun add syner
```

```ts
import { ShadcnRegistry } from "syner"
import { Button } from "@/components/button"
const shadcn = new ShadcnRegistry()

shadcn.add(Button)

export const GET = shadcn.json()
````
