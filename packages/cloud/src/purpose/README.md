<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">purpose</h1>

<p align="center">
  <strong>What an app is for, and whether it's fulfilling it.</strong>
</p>

Syner OS asks five questions about an app. Four are answered by looking at the
app from the outside: is it running, what changed, what does it cost, who has
access. The fifth, "is it fulfilling its purpose?", can't be answered without
knowing what the app was for. Purpose holds that knowledge.

## What a purpose looks like

- **Statement.** one human sentence: "Issue every customer's invoice for the
  month and collect it through Stripe before the 5th."
- **Criteria.** measurable conditions: 100% of invoices issued before the 3rd;
  fewer than 2% failed charges; monthly cost under $40.
- **Declared by, since.** who wrote it and when.
- **Evaluations.** one per run of evaluate: date, result (met, partial,
  unmet), and the evidence it used.

## What you can do with it

| Verb | Who | What happens |
|---|---|---|
| [declare](declare/README.md) | a member of the organization | writes or replaces the statement and criteria |
| [evaluate](evaluate/README.md) | Syner OS, Syner Bot, or a job | compares the declaration with activity and usage, records a result |
| [get](get/README.md) | anyone who can read the app | returns the declaration and its latest evaluation |

## How it relates to the rest

An app can be green in [ops](../ops/README.md) and red here: it runs fine, and
invoices still go out late. Evaluations read [activity](../activity/README.md)
and [usage](../usage/README.md), and change nothing there.
