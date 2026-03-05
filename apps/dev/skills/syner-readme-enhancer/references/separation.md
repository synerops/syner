# Content Separation

When an existing README has too much content, separate concerns.

## Content That Stays

- What is it (one line)
- How it works (the flow)
- How to try it (commands)
- Context hierarchy position
- Skills list (if any)
- Integrations status (if relevant)

## Content That Moves

- Detailed setup instructions → Skill (e.g., `/vercel-setup`)
- Package documentation → `packages/{pkg}/README.md`
- API reference → `docs/` or inline in code
- Environment variables → `.env.example` + skill

## Content to Remove

- Duplicate information
- Information about other components
- Verbose explanations that don't answer the 3 questions

## Principle

The README is an entry point, not documentation. Link to details, don't include them.
