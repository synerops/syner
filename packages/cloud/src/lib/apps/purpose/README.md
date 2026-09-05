<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">purpose</h1>

<p align="center">
  <strong>What an app is for, as part of its spec.</strong>
</p>

An app carries a statement of what it is for and, optionally, the criteria its
organization would use to judge it. That description belongs to the app's spec
and lives here. It answers the fifth question of Syner OS, "is it fulfilling
its purpose?", only in the sense that the question can be asked: measuring the
answer is not agreed.

## What the description holds

- **Statement.** One human sentence: "Issue every customer's invoice for the
  month and collect it through Stripe before the 5th."
- **Criteria.** Conditions the organization cares about, written as text: 100%
  of invoices issued before the 3rd; fewer than 2% failed charges; monthly
  cost under $40.
- **Declared by, since.** Who wrote it and when.

## What is not agreed

Automatic evaluation of the criteria. An earlier proposal defined `declare`,
`evaluate`, and `get` as public operations, results `met`, `partial`, and
`unmet`, and evidence taken from activity and usage. It is preserved below as
a pending proposal, not as an API.

## Limits that any evaluation must respect

- Administrative activity and consumption do not measure business results.
  Activity records who deployed, changed, or was denied; usage records
  seconds, bytes, and calls. Neither says how many invoices went out or how
  many charges failed.
- How the business evidence would be obtained is undefined: reported by the
  app, read from its storage, or something else.
- Absence of evidence is not failure. A criterion that cannot be measured has
  no result; it is never `unmet`.
- A successful deployment, a healthy app, and an app that fulfills its purpose
  are three different states. [Operations](../../operations/README.md) speaks
  to the first; the second has no evidence source yet; this node speaks to the
  third.

## Preserved proposal (pending)

Kept for reference. Nothing here is approved.

- **Statement.** one human sentence: "Issue every customer's invoice for the
  month and collect it through Stripe before the 5th."
- **Criteria.** measurable conditions: 100% of invoices issued before the 3rd;
  fewer than 2% failed charges; monthly cost under $40.
- **Declared by, since.** who wrote it and when.
- **Evaluations.** one per run of evaluate: date, result (met, partial,
  unmet), and the evidence it used.

| Proposed operation | What it would do |
|---|---|
| declare | writes or replaces the statement and criteria |
| evaluate | compares the declaration with activity and usage, records a result |
| get | returns the declaration and its latest evaluation |
