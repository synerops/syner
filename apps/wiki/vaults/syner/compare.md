# Compare Mode

A mode for observing differences without acting on them.

## What This Mode Is

A contract of voluntary restriction. When you enter compare mode, you limit your action space to observation and analysis only.

```
All capabilities
    ↓ (enter compare mode)
Observe + Analyze + Document
```

The paradox: less capability → more effectiveness. You become better at comparing precisely because you can't do anything else.

## Constraints

What you CANNOT do in compare mode:

- Edit files (no merging yet)
- Execute code
- Declare premature winners
- Skip dimensions to favor one side
- Summarize without evidence

## Capabilities

What you CAN do:

- Read files
- Analyze structures
- Generate comparative tables
- Ask clarifying questions
- Produce the comparison document

## Activation

Enter compare mode when:
- User says "compare X vs Y"
- User asks "what's the difference between..."
- You need to understand two approaches before choosing

## Exit Criteria

Exit compare mode when:
- Comparison document is complete with action recommendation
- User explicitly chooses to act
- Purpose (choose/learn/create/validate) is fulfilled

---

## Why Compare

Comparison is the primitive operation of understanding. You cannot define X without relating it to not-X.

| Purpose | Question | Output |
|---------|----------|--------|
| Choose | Which one do I use? | Decision |
| Learn | What am I missing? | Growth areas |
| Create | What space is uncovered? | New thing |
| Validate | Am I on track? | Confidence/correction |

Before comparing, know your purpose. It shapes what you notice.

## The Schema

### 1. Identity

What are you comparing? Name them without judgment.

```
A: [name] - [one-line description]
B: [name] - [one-line description]
```

### 2. Dimensions

Choose dimensions that matter for your purpose. Common ones:

| Dimension | Question |
|-----------|----------|
| Scope | What does it cover? |
| Depth | How thoroughly? |
| Style | How does it feel? |
| Trade-offs | What did it sacrifice? |
| Coherence | Does it hold together? |

### 3. Symmetric Analysis

For each dimension, analyze both sides. Resist the urge to declare winners per dimension.

```markdown
## [Dimension]

**A**: [observation]
**B**: [observation]
```

### 4. Asymmetric Findings

What does A have that B lacks? And vice versa? This is where value emerges.

```markdown
## A has, B lacks
- [finding]

## B has, A lacks
- [finding]
```

### 5. The Narrator Check

How you narrate reveals what you value. Watch for:

| Pattern | Reveals |
|---------|---------|
| "I have X, they don't" | Territory, ego |
| "They captured X better" | Truth, growth |
| "Both are good" | Conflict avoidance |
| "X is objectively better" | Hidden assumptions |

Ask: *What does my framing expose about my priorities?*

### 6. Action

Based on purpose, decide:

| Purpose | Possible Actions |
|---------|------------------|
| Choose | Pick one, document why |
| Learn | Extract what's missing, apply |
| Create | Find the gap, fill it |
| Validate | Adjust course or continue |

### 7. The Merge Question

When both things seem valuable, the instinct is to merge. But:

```
Coherent A + Coherent B = Coherent C?
```

Not always. Sometimes things are good *because* they're different. Merging can destroy what made them valuable.

Before merging, ask:
- What makes each one coherent on its own?
- Will combining them preserve or destroy that coherence?
- Is "both" actually better than "one, chosen well"?

### 8. Semantic Summary (on request)

When the user asks for explanation, transform the structured analysis into a narrative.

**Trigger**: User says "explain", "summarize", "what does this mean", or similar.

**Format**:

```markdown
## Summary

[Verdict]: One sentence - what should happen?

[Evidence]: What findings led to this conclusion?

[Trade-off]: What are you sacrificing with this choice?

[Next step]: Concrete action to take.
```

**Why separate**: The comparison document is proof. The summary is understanding. Not everyone needs both.

## Anti-Patterns

| Anti-Pattern | Problem |
|--------------|---------|
| Comparing without purpose | You'll notice everything, learn nothing |
| Symmetric false balance | "Both have pros and cons" avoids judgment |
| Dimension shopping | Picking dimensions where your favorite wins |
| Merge by default | Combining things that should stay separate |
| Winner-take-all | Discarding the loser entirely |

## Template

```markdown
# Comparing [A] vs [B]

**Purpose**: [choose/learn/create/validate]

## Identity
- A: [description]
- B: [description]

## Dimensions
[For each relevant dimension]

### [Dimension Name]
- A: [observation]
- B: [observation]

## Asymmetric Findings

### A has, B lacks
- [finding]

### B has, A lacks
- [finding]

## Narrator Check
[What does my framing reveal?]

## Action
[Decision based on purpose]

## Merge Assessment
[Should these combine? Why/why not?]

## Summary (if requested)
[Verdict]: ...
[Evidence]: ...
[Trade-off]: ...
[Next step]: ...
```

## Meta

This schema itself is a comparison tool. To validate it, compare:
- Comparisons made with this schema vs without
- If the schema produces better decisions, it works
- If not, the schema needs revision

The framework is not precious. Adapt it.
