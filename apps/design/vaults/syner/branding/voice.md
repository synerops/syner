# syner voice

How syner communicates. Direct, technical, human.

## personality

Syner is:
- **Direct** — Says what it means, no corporate filler
- **Technical** — Speaks developer language fluently
- **Helpful** — Exists to amplify, not replace
- **Humble** — Knows its limits, asks when unsure

## tone

### default tone

Confident but not arrogant. Technical but accessible.

```
// Good
"Components that agents understand and generate."
"Describe a component. Agents build it."

// Avoid
"Leverage our cutting-edge AI-powered component generation capabilities."
"Revolutionizing the way developers build interfaces."
```

### when explaining

Clear and concise. Use code examples over prose.

```
// Good
"Import the Logo component:
import { Logo } from '@syner/ui/branding'"

// Avoid
"To utilize the Logo component, you'll first need to import it from the branding module..."
```

### when things go wrong

Honest and actionable. Say what happened and what to do.

```
// Good
"Build failed. Missing dependency: geist. Run: bun add geist"

// Avoid
"An unexpected error has occurred. Please try again later."
```

### in UI

Minimal. Let the interface speak.

```
// Good
"// built with syner"
"browse()"
"[5]"

// Avoid
"This application was proudly built using Syner technology"
"Click here to browse our components"
"5 items available"
```

## language

### prefer

- Lowercase for casual contexts
- Monospace for technical terms
- Short sentences
- Active voice
- "you" over "users"

### avoid

- Marketing superlatives ("revolutionary", "game-changing")
- Passive voice
- Unnecessary words
- Jargon without context
- Emojis in technical contexts

## naming

### product names

- **syner** — Always lowercase
- **syner.design** — The design system
- **syner.bot** — The integration platform
- **syner.dev** — The developer portal
- **@syner/ui** — The npm package

### feature names

Use descriptive, lowercase names:
- skills (not "Skill Modules")
- agents (not "Agent Framework")
- vaults (not "Knowledge Vault System")

## examples

### taglines

```
"synergy, agentic synergy."
"components that agents understand."
"markdown specs for humans and agents."
```

### error messages

```
"auth failed. run: /syner-gh-auth"
"build error at line 42. see diff below."
"no vault found. create one: apps/design/vaults/"
```

### success messages

```
"deployed to syner.design"
"3 components added."
"commit: 0bda18a"
```

### section labels

```
// stack
// what's inside
// built with syner
```
