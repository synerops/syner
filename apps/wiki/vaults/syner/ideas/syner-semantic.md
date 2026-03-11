# syner-semantic

Transformer agent that extracts implicit semantics from structured data.

## The Insight

Data already contains semantic signals, but they're implicit:

```
ID pattern "D2-*"  →  Implicit category
Priority 1         →  Implicit rationale
Multiple targets   →  Implicit batch operation
```

## What It Would Do

```
Structured JSON (from planner, reviewer, etc.)
    ↓ syner-semantic
Semantically enriched JSON
```

### Input
```json
{
  "items": [
    { "id": "D2-1", "title": "Standardize tools format", "priority": 1 },
    { "id": "D2-2", "title": "Document triggers field", "priority": 2 }
  ]
}
```

### Output
```json
{
  "semantic": {
    "categories": [
      { "id": "D2", "name": "Frontmatter Standardization", "items": ["D2-1", "D2-2"] }
    ],
    "dependencies": {
      "D2-2": { "blockedBy": ["D2-1"] }
    },
    "priority_rationale": {
      "1": "No dependencies, atomic change",
      "2": "Requires decision between options"
    }
  },
  "items": [...]
}
```

## Why Separate Agent

- syner-planner focuses on actionability (target, action, verify)
- syner-semantic focuses on relationships (categories, dependencies, rationale)
- Separation of concerns = each agent does one thing well

## Potential Uses

- Enrich plans before execution
- Group related items for batch processing
- Detect hidden dependencies
- Generate better summaries

## Status

Idea. Not implemented.
