---
name: test-syner-package
description: Test a syner package for correctness. Validates structure, runs typecheck if available, verifies discovery, and runs agentic tests via syner-context. Use when creating a new package, after modifying a package, or to verify a package works correctly.
---

# Test Syner Package

Validate that a syner package is correctly structured and functional.

## Process

### Step 1: Identify Package

If no package specified, list available packages and ask which to test:

```bash
ls packages/
```

### Step 2: Static Validation

Check required structure:

```
packages/<name>/
├── package.json           # Required
├── README.md              # Required
└── skills/
    ├── context/SKILL.md   # At least one of these
    └── actions/SKILL.md   # must exist
```

**Checks:**

1. **package.json exists**
2. **README.md exists**
3. **At least one skill exists** (context or actions)
4. **Frontmatter is correct** for each SKILL.md:
   - Has `name: syner-<package>-context` or `syner-<package>-actions`
   - Has `description` containing "Use when"

### Step 3: Typecheck

If `package.json` has a `typecheck` script, run it:

```bash
cd packages/<name> && bun run typecheck
```

Report pass/fail.

### Step 4: Discovery

Verify Glob finds the skills:

- Context: `Glob packages/<name>/skills/context/SKILL.md`
- Actions: `Glob packages/<name>/skills/actions/SKILL.md`

### Step 5: Agentic Test

For each skill found:

1. **Read the skill** to understand what it does
2. **Generate a test task** based on the description
3. **Invoke syner-context** (for context skills) or **syner-worker** (for action skills)
4. **Evaluate the output**:
   - Did the subagent discover and use the package skill?
   - Is the output condensed (not a raw dump)?
   - Does it answer the test task?

## Output

Report results:

```
## Test Results: packages/<name>

### Static Validation
- [x] package.json exists
- [x] README.md exists
- [x] skills/context/SKILL.md exists
- [ ] skills/actions/SKILL.md exists (optional)
- [x] Frontmatter correct

### Typecheck
- [x] Passed (or N/A if no script)

### Discovery
- [x] Context skill discoverable
- [ ] Actions skill discoverable (N/A)

### Agentic Test
- [x] syner-context invoked skill
- [x] Output is condensed
- [x] Output answers test task

### Summary
✓ Package is valid and functional
```

## Edge Cases

- If package has no `typecheck` script, skip that step
- If package only has context OR actions (not both), that's valid
- If agentic test fails, report the error and suggest fixes
