---
name: audit
description: >
  Formal audit skill based on ISO 27001 and ISACA/ITAF standards. Use when a
  formal, structured audit report is needed — not for informal code reviews.
  Produces structured output with frontmatter and standard sections.
---

# /audit — Formal Audit Template

Generate structured audit reports following ISO 27001 and ISACA/ITAF standards.

## STRICT FORMAT — DO NOT IMPROVISE

This skill defines an **exact template**. You MUST:

1. Use the **exact filename format**: `.syner/audits/{YYYY-MM-DD}-{subject-slug}.md`
2. Include **YAML frontmatter** with ALL required fields (type, date, agent, objectives, scope, status, opinion, findings)
3. Use **exactly 4 body sections**: Criteria, Findings, Recommendations, Conclusion
4. Use **opinion enum values only**: unqualified, qualified, adverse, disclaimer
5. **Count findings** by severity in frontmatter (critical, major, minor)

Do NOT:
- Invent your own structure
- Skip the frontmatter
- Add extra sections
- Use different field names

The format is machine-parseable. Deviations break tooling.

## When to Use

- Compliance audits
- Security assessments requiring formal documentation
- Process audits
- Any situation requiring a formal audit trail

For informal reviews (PR reviews, quick code checks), use normal reviewer workflow.

## Output Location

Audits MUST be saved to a file, never just returned as text.

```
.syner/audits/{YYYY-MM-DD}-{subject-slug}.md
```

**Examples:**
- `.syner/audits/2026-02-20-syner.md`
- `.syner/audits/2026-02-20-auth-flow-security.md`
- `.syner/audits/2026-02-20-sdk-api-compliance.md`

**Rules:**
1. Create `.syner/audits/` if it doesn't exist
2. Use kebab-case for subject slug
3. One audit per file
4. Always write the file — never just output text to console

## Output Format

Audit reports MUST use this structure:

### Frontmatter (parseable, queryable)

```yaml
---
type: audit
date: YYYY-MM-DD
agent: reviewer

# Scope & Objectives (ISACA mandatory)
objectives: "Determinar si..."
scope:
  - path/to/files/**/*.md

# Results
status: complete | in_progress | failed
opinion: unqualified | qualified | adverse | disclaimer  # ISACA expression of opinion
findings:
  critical: 0
  major: 0
  minor: 0
---
```

### Body (detailed findings)

```markdown
## Criteria
<!-- ISO: Methodology and Criteria -->
<!-- ISACA: Source of Criteria (standards/benchmarks) -->
The standards, benchmarks, or criteria against which the audit was performed.

## Findings
<!-- ISO: Summary of Findings + Non-Conformities -->
<!-- ISACA: Findings with severity -->
Detailed findings with evidence and severity classification.

## Recommendations
<!-- ISO: Recommendations and Corrective Actions -->
Suggested corrective actions for each finding.

## Conclusion
<!-- ISO: Audit Conclusion -->
<!-- ISACA: Expression of Opinion justification -->
Final summary justifying the opinion expressed.
```

## Opinion Types (ISACA)

| Opinion | Meaning |
|---------|---------|
| **unqualified** | No significant issues found, full compliance |
| **qualified** | Minor issues that don't affect overall compliance |
| **adverse** | Significant issues, non-compliant |
| **disclaimer** | Unable to form an opinion (insufficient evidence) |

## Finding Severity

| Severity | Description |
|----------|-------------|
| **critical** | Immediate action required, severe risk |
| **major** | Should be addressed soon, significant impact |
| **minor** | Low risk, can be addressed in normal course |

## Standards Mapping

| Field | ISO 27001 | ISACA/ITAF |
|-------|-----------|------------|
| date, agent | Audit Details | - |
| objectives | Scope and Objectives | Objectives of the Audit |
| scope | Scope and Objectives | Scope of Engagement |
| opinion | Conclusion | Expression of Opinion |
| findings | Non-Conformities | Findings |
| Criteria (body) | Methodology and Criteria | Source of Criteria |
| Recommendations (body) | Corrective Actions | Recommendations |

## Execution Flow

1. **Define scope** — what files, systems, or processes?
2. **Establish criteria** — what standards apply?
3. **Gather evidence** — read files, analyze behavior
4. **Classify findings** — critical / major / minor
5. **Form opinion** — based on findings
6. **Write report** — save to `audits/{date}-{subject}.md` using template above

## Example

**File:** `.syner/audits/2026-02-20-syner.md`

```yaml
---
type: audit
date: 2026-02-20
agent: reviewer
objectives: "Verify SYNER.md accurately reflects system capabilities"
scope:
  - packages/syner/SYNER.md
status: complete
opinion: qualified
findings:
  critical: 0
  major: 1
  minor: 2
---
```

```markdown
## Criteria

- Documentation accuracy against actual implementation
- Consistency with OS Protocol specifications
- Clarity and completeness

## Findings

### Major
- **M1**: Agent table missing audit capability reference

### Minor
- **m1**: Workflow table could include link to skill definitions
- **m2**: Missing example of delegation syntax

## Recommendations

- M1: Add audit capability to reviewer row in Agents table
- m1: Add links to /route, /orchestrate skills
- m2: Include Task() usage example

## Conclusion

SYNER.md is mostly accurate but has a notable gap in documenting
the audit workflow. Qualified opinion issued due to incomplete
capability documentation.
```
