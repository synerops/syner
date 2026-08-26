# Checks API

> Implements the `checks` contract from the OS Protocol.

## Purpose

Verify that actions were successful without performing actions.

## API Hierarchy

```
checks/
├── rules.ts                  (rule-based validation)
├── judge.ts                  (judgment logic)
├── screenshot.ts             (visual verification)
└── waiting-for-approval.ts   (approval workflows)
```

## Integration Points

This API is designed to integrate with:

- **Rule engines** via `rules.ts`
- **LLM-based judges** via `judge.ts`
- **Visual validation** via `screenshot.ts`
- **Human approval** via `waiting-for-approval.ts`

## Directives

**MUST** only validate - never perform actions

**MUST** verify results from the actions API

**SHOULD** provide clear pass/fail results

**NEVER** modify state - only check it

**NEVER** execute operations - only verify their results
