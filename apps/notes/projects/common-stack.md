# common stack in syner ecosystem

## language

typescript with [bun](https://bun.com/docs/llms.txt)

## full stack

for convenience, use next with typescript, shadcn as design system

## local

for local development, use the cli `next`

## production

vercel using cli

## git

for git related tasks, use the cli `gh` via `@syner/github` package:
```bash
bun run github exec -- gh <command>
```

## code review

use the skill `/vercel-react-best-practices` to review code
use the skill `/web-design-guidelines` in case UI / Design related requests
