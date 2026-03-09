# component guidelines

How to use and extend syner.design components.

---

## primitives from shadcn

We use shadcn/ui as our primitive layer. Components are installed into `packages/ui` and customized through tokens.

### installed components

| Component | Status | Notes |
|-----------|--------|-------|
| Button | Ready | 6 variants, 4 sizes |
| Card | Ready | Border style, no shadow |
| Badge | Ready | Uppercase labels |
| Input | Ready | Terminal-style option |
| Separator | Ready | Subtle dividers |

### adding components

```bash
cd packages/ui
bunx shadcn@latest add [component]
```

Components automatically inherit our tokens from `globals.css`.

---

## button

### variants

| Variant | When to use |
|---------|-------------|
| `default` | Primary actions |
| `secondary` | Secondary actions |
| `outline` | Tertiary, less emphasis |
| `ghost` | In toolbars, minimal UI |
| `destructive` | Dangerous actions |
| `link` | Inline text links |

### sizes

| Size | When to use |
|------|-------------|
| `default` | Standard buttons |
| `sm` | Compact UI, tables |
| `lg` | Hero CTAs |
| `icon` | Icon-only buttons |

### examples

```tsx
// Primary CTA
<Button size="lg">Get Started</Button>

// Secondary action
<Button variant="secondary">Learn More</Button>

// Icon button
<Button variant="ghost" size="icon">
  <GitHubIcon />
</Button>
```

---

## card

### anatomy

```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
  <CardFooter>
    Actions here
  </CardFooter>
</Card>
```

### guidelines

- Always use border, never shadow
- Background slightly lighter than page
- Padding: p-6 default
- For feature cards, add uppercase label above title

### feature card pattern

```tsx
<Card>
  <CardHeader>
    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
      COMPONENTS
    </p>
    <CardTitle>Button</CardTitle>
    <CardDescription>
      6 variants for every context
    </CardDescription>
  </CardHeader>
  <CardFooter>
    <Button variant="ghost" size="sm">
      View docs <ArrowRight className="ml-1 h-4 w-4" />
    </Button>
  </CardFooter>
</Card>
```

---

## badge

### usage

Labels, tags, status indicators.

```tsx
// Section label
<Badge variant="outline" className="uppercase tracking-wide">
  Components
</Badge>

// Status
<Badge variant="secondary">Ready</Badge>

// Coming soon
<Badge variant="outline" className="text-muted-foreground">
  Coming Soon
</Badge>
```

### guidelines

- Use `outline` variant for section labels
- Uppercase with tracking-wide for labels
- Keep text short (1-2 words)

---

## input

### terminal style

For search inputs with command prompt aesthetic:

```tsx
<div className="relative">
  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-muted-foreground">
    $
  </span>
  <Input
    placeholder="search components..."
    className="pl-7 font-mono"
  />
</div>
```

### guidelines

- Use monospace for search/command inputs
- Standard sans for form inputs
- Always show focus ring

---

## separator

### usage

```tsx
// Horizontal
<Separator className="my-8" />

// Vertical (in flex row)
<Separator orientation="vertical" className="h-6" />
```

### guidelines

- Use sparingly — whitespace often enough
- Color matches `--border` (subtle)

---

## composition patterns

### hero section

```tsx
<section className="flex flex-col items-center gap-6 py-16 text-center">
  <Badge variant="outline" className="uppercase tracking-wide">
    Label
  </Badge>
  <h1 className="text-5xl font-bold tracking-tight">
    Title
  </h1>
  <p className="max-w-md text-lg text-muted-foreground">
    Description
  </p>
  <div className="flex gap-2">
    <Button>Primary</Button>
    <Button variant="outline">Secondary</Button>
  </div>
</section>
```

### tech grid

```tsx
<div className="grid grid-cols-5 gap-4">
  {techs.map((tech) => (
    <div key={tech.name} className="flex flex-col items-center gap-2 p-4">
      <tech.icon className="h-6 w-6 text-muted-foreground" />
      <span className="text-xs font-medium uppercase tracking-wide">
        {tech.name}
      </span>
      <span className="text-xs text-muted-foreground">
        {tech.label}
      </span>
    </div>
  ))}
</div>
```

### feature cards grid

```tsx
<div className="grid grid-cols-2 gap-4">
  <Card>...</Card>
  <Card>...</Card>
</div>
```

---

## anti-patterns

### don't

- Add shadows to cards
- Use rounded-xl or larger
- Mix font families beyond Geist
- Use colored backgrounds for cards
- Add gradients
- Use light mode as default

### do

- Keep borders subtle (1px zinc-800)
- Use spacing generously
- Let content breathe
- Trust the dark background
- Use monospace for technical elements
