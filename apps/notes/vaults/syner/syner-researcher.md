# syner-researcher

## skill

use `/syner-researcher` to research any topic, routing to the right source automatically

### how it works

1. classifies the topic by signal keywords
2. routes to the appropriate source:

| type | signals | source |
|------|---------|--------|
| Claude Code | skill, hook, MCP, subagent, agent SDK, CLI | `claude-code-guide` subagent |
| Web/General | library, framework, technology, API, concept | `WebSearch` + `WebFetch` |
| Internal | "my notes", "mi vault", project-specific | `Glob` + `Read` on vault |

3. compiles findings into structured output
4. optionally saves to vault if "save" or "guardar" included

### usage

```
/syner-researcher [topic]
```

examples:
- `/syner-researcher hooks de claude code` - uses claude-code-guide subagent
- `/syner-researcher react server components` - searches web
- `/syner-researcher what I wrote about AI agents` - searches vault
- `/syner-researcher vercel edge functions save` - searches web and saves to vault

### output format

- **Core concept**: one-paragraph explanation
- **Key points**: 3-5 bullets
- **Examples**: code snippets if applicable
- **Watch out for**: common gotchas
- **Sources**: where info came from

## testing

to test on next session:

1. `/syner-researcher hooks de claude code` - verify uses claude-code-guide
2. `/syner-researcher react server components 2026` - verify uses WebSearch
3. `/syner-researcher what I wrote about syner` - verify searches vault
