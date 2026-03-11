# create-syner-app

## stack

follow [common stack](./common-stack.md) guidelines

## skill

use `/create-syner-app` to scaffold new apps automatically

### how it works

1. reads [common-stack](./common-stack.md) to get the current stack
2. runs `bunx create-next-app@latest` with TypeScript + Tailwind
3. initializes shadcn with `bunx shadcn@latest init --defaults`

### additional patterns

For apps that serve markdown content with content negotiation, see [syner.md](./syner.md).

### usage

```
/create-syner-app [app-name]
```

examples:
- `/create-syner-app my-dashboard` - creates app in `apps/my-dashboard`
- `/create-syner-app` - prompts for app name

## testing

to test on next session:

1. `/state` - load full context first
2. `/create-syner-app test-app` - create test app
3. verify it reads common-stack.md dynamically
4. verify structure: Next.js + TypeScript + shadcn
5. cleanup: `rm -rf apps/test-app`
