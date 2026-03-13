# card

Card primitive with two variants. Uses only shadcn/ui standard components.

## philosophy

**No new components.** Only variants. Style with classes, not custom components.

## variants

### default - Standard card

Traditional content card from shadcn/ui. No modifications.

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@syner/ui/components/card";

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Your content here
  </CardContent>
  <CardFooter>
    Actions here
  </CardFooter>
</Card>
```

**Characteristics:**
- Rounded corners (`rounded-xl`)
- Background fill (`bg-card`)
- Subtle shadow (`shadow-sm`)
- Padding: `py-6` (24px vertical)
- Gap: `gap-6` (24px between sections)

### bracket - Minimal showcase

Terminal-inspired card with corner L-brackets. Auto-rendered on `variant="bracket"`.

```tsx
import { Card, CardTitle, CardDescription } from "@syner/ui/components/card";
import { ArrowRight } from "lucide-react";

<Card variant="bracket">
  <div className="space-y-3">
    <CardDescription className="text-[8px] uppercase tracking-[0.2em]">
      AUTHENTICATION
    </CardDescription>
    <CardTitle className="text-[20px] font-bold tracking-tight leading-tight">
      Secure by default.
    </CardTitle>
    <CardDescription className="text-[9px] leading-relaxed max-w-[280px]">
      Session-based auth with social logins, magic links, and role-based access out of the box.
    </CardDescription>
  </div>
  <a href="/docs" className="text-[9px] font-medium text-foreground flex items-center gap-1.5">
    View docs
    <ArrowRight size={10} />
  </a>
</Card>
```

**Characteristics:**
- Corner L-brackets at 4 corners (auto-rendered, 10% opacity)
- No rounded corners
- No background fill (border-only)
- Hover: brackets intensify (20% opacity)
- Padding: `p-6` (24px all sides)
- Min-height: `214px`
- Layout: `flex flex-col justify-between`

## anatomy

### Standard (default)

```
┌─────────────────────────────┐
│ CardHeader                  │
│   CardTitle                 │
│   CardDescription           │
├─────────────────────────────┤
│ CardContent                 │
│   (your content)            │
├─────────────────────────────┤
│ CardFooter                  │
│   (actions)                 │
└─────────────────────────────┘
```

### Bracket

```
┌──                        ──┐  ← Auto-rendered brackets
│                            │
│  <CardDescription>         │  ← Label (uppercase, 8px)
│    LABEL                   │
│  </CardDescription>        │
│                            │
│  <CardTitle>               │  ← Title (bold, 20px)
│    Title                   │
│  </CardTitle>              │
│                            │
│  <CardDescription>         │  ← Description (9px)
│    Description...          │
│  </CardDescription>        │
│                            │
│  <a>Action →</a>           │  ← Optional link
│                            │
└──                        ──┘
```

## components

Same components for both variants. Style with classes.

| Component | Purpose | Default Usage | Bracket Usage |
|-----------|---------|---------------|---------------|
| `Card` | Container | `<Card>` | `<Card variant="bracket">` |
| `CardHeader` | Header section | Wrapper for title/description | Not used (manual layout) |
| `CardTitle` | Title | Default styling | `className="text-[20px] font-bold"` |
| `CardDescription` | Description | Default styling | Label: `className="text-[8px] uppercase"`<br/>Body: `className="text-[9px]"` |
| `CardContent` | Content area | Main content | Not used (manual layout) |
| `CardFooter` | Footer | Actions | Not used (use `<a>` directly) |

## styling patterns

### Bracket variant classes

**Label (uppercase):**
```tsx
<CardDescription className="text-[8px] uppercase tracking-[0.2em]">
  LABEL
</CardDescription>
```

**Title (large bold):**
```tsx
<CardTitle className="text-[20px] font-bold tracking-tight leading-tight">
  Title text
</CardTitle>
```

**Description (small muted):**
```tsx
<CardDescription className="text-[9px] leading-relaxed max-w-[280px]">
  Description text
</CardDescription>
```

**Action link:**
```tsx
<a href="/path" className="text-[9px] font-medium text-foreground flex items-center gap-1.5 group-hover:gap-2.5 transition-all duration-300">
  Action text
  <ArrowRight size={10} className="transition-transform duration-300 group-hover:translate-x-0.5" />
</a>
```

**Decorative circle (optional):**
```tsx
<div className="absolute top-6 right-6 size-2 rounded-full border border-border bg-background transition-transform duration-200 delay-100 group-hover:scale-110" />
```

## examples

### Bracket with action

```tsx
<Card variant="bracket">
  <div className="space-y-3">
    <CardDescription className="text-[8px] uppercase tracking-[0.2em]">
      PAYMENTS
    </CardDescription>
    <CardTitle className="text-[20px] font-bold tracking-tight leading-tight">
      Get paid globally.
    </CardTitle>
    <CardDescription className="text-[9px] leading-relaxed max-w-[280px]">
      Subscriptions, one-time payments, and usage-based billing with zero config.
    </CardDescription>
  </div>
  <a href="/docs/payments" className="text-[9px] font-medium text-foreground flex items-center gap-1.5">
    Integrate
    <ArrowRight size={10} />
  </a>
</Card>
```

### Bracket with decorative circle

```tsx
<Card variant="bracket">
  <div className="space-y-3">
    <CardDescription className="text-[8px] uppercase tracking-[0.2em]">
      DATABASE
    </CardDescription>
    <CardTitle className="text-[20px] font-bold tracking-tight leading-tight">
      Query anything.
    </CardTitle>
    <CardDescription className="text-[9px] leading-relaxed max-w-[280px]">
      Postgres with Drizzle ORM. Type-safe queries out of the box.
    </CardDescription>
  </div>
  <a href="/docs/database" className="text-[9px] font-medium text-foreground flex items-center gap-1.5">
    Explore
    <ArrowRight size={10} />
  </a>
  {/* Decorative circle */}
  <div className="absolute top-6 right-6 size-2 rounded-full border border-border bg-background group-hover:scale-110 transition-transform" />
</Card>
```

### Bracket without action

```tsx
<Card variant="bracket">
  <div className="space-y-3">
    <CardDescription className="text-[8px] uppercase tracking-[0.2em]">
      TYPESCRIPT
    </CardDescription>
    <CardTitle className="text-[20px] font-bold tracking-tight leading-tight">
      Type-safe.
    </CardTitle>
    <CardDescription className="text-[9px] leading-relaxed max-w-[280px]">
      End-to-end type safety from database to frontend.
    </CardDescription>
  </div>
</Card>
```

### Standard with header/content

```tsx
<Card>
  <CardHeader>
    <CardTitle>Settings</CardTitle>
    <CardDescription>Manage your account settings</CardDescription>
  </CardHeader>
  <CardContent>
    <p className="text-sm text-muted-foreground">
      Your content here.
    </p>
  </CardContent>
</Card>
```

### Grid layout

```tsx
<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
  <Card variant="bracket">...</Card>
  <Card variant="bracket">...</Card>
  <Card variant="bracket">...</Card>
</div>
```

## guidelines

### When to use bracket

✅ **Use for:**
- Feature showcases on landing pages
- Product highlights
- Marketing sections
- Visual emphasis on key info

❌ **Don't use for:**
- Forms (use default)
- Data tables (use default)
- Settings panels (use default)
- Nested content (use default)

### When to use default

✅ **Use for:**
- Dashboard widgets
- Form sections
- Content blocks
- Data display
- General UI

### Content guidelines

**Labels:** 1-2 words, uppercase
**Titles:** 2-5 words, punchy
**Descriptions:** 1-2 sentences max
**Actions:** Clear verb (View, Integrate, Explore)

## customization

### Override bracket opacity

```tsx
<Card variant="bracket" className="[&>span]:border-foreground/30">
  {/* Brackets at 30% instead of 10% */}
</Card>
```

### Custom min-height

```tsx
<Card variant="bracket" className="min-h-[300px]">
  {/* Taller card */}
</Card>
```

### Remove shadow from default

```tsx
<Card className="shadow-none">
  {/* No shadow */}
</Card>
```

## accessibility

- Semantic HTML (`<a>` for links)
- WCAG AA color contrast
- Keyboard navigable
- No custom components to break a11y

## anti-patterns

### Don't

- Create new components (use classes)
- Mix variants in same grid
- Add shadows to bracket
- Use colored backgrounds on bracket
- Nest cards

### Do

- Use standard shadcn components
- Apply classes for styling
- Keep content concise
- Use consistent spacing
- Trust the variant system

## key principle

**Variants, not components.** The bracket variant is just `Card` with:
1. Auto-rendered corner brackets
2. Different base classes
3. Manual styling with standard components

No `CardLabel`, `CardTitleBracket`, or other custom components. Just `CardTitle` and `CardDescription` with different classes.

## inspiration

**Default:** shadcn/ui standard
**Bracket:** Vercel/Linear/Stripe landing pages with terminal aesthetic
