# Skill: update-syner-app

# Update Syner App

## Purpose

Update existing applications to match the current syner standard stack. This ensures all apps in the ecosystem maintain the same foundation and tooling, even if they were created before certain standards were established.

## When to Use

- User asks to update an existing app to current standards
- User mentions "update app", "add shadcn", "modernize app", "sync with stack"
- When an app is missing components from the common stack
- After changes to `common-stack.md` that need to be applied to existing apps

## Instructions

### 1. Identify Target App

If app name not provided as argument, ask the user:
```
Which app would you like to update?
```

List available apps from the `apps/` directory to help the user choose.

### 2. Read Current Stack

Use the `Read` tool to load `apps/notes/vaults/syner/common-stack.md`.

This step is mandatory - the skill ALWAYS reads common-stack.md before acting. This ensures we apply the latest stack standards.

### 3. Analyze Current App State

Check what the app currently has:
- Read `apps/[name]/package.json` to check dependencies
- Check for `apps/[name]/tailwind.config.ts` or `.js`
- Check for `apps/[name]/components.json` (shadcn config)
- Check for `apps/[name]/lib/utils.ts` (shadcn utility)
- List any other relevant configuration files

### 4. Determine Missing Components

Based on the common stack, identify what's missing:
- Tailwind CSS
- shadcn/ui
- TypeScript configuration
- ESLint configuration
- Other stack components

### 5. Update Dependencies

#### If Tailwind is missing:
```bash
cd apps/[name] && bun add -D tailwindcss postcss autoprefixer
cd apps/[name] && bunx tailwindcss init -p
```

Then create/update the global CSS file with Tailwind directives.

#### If shadcn is missing:
```bash
cd apps/[name] && bunx shadcn@latest init --defaults
```

This will:
- Install required dependencies (@radix-ui, class-variance-authority, clsx, etc.)
- Create `components.json`
- Create `lib/utils.ts`
- Update `tailwind.config.ts`

### 6. Fix Common Issues

After adding shadcn, common fixes needed:

#### Update layout.tsx for Tailwind CSS:
- Import the global CSS file
- Add proper font configuration
- Ensure HTML has proper lang attribute

#### Update tsconfig.json paths:
Ensure the following paths exist:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### 7. Add Example Component (Optional)

Ask the user if they want to add an example shadcn component to verify the setup:
```bash
cd apps/[name] && bunx shadcn@latest add button
```

### 8. Verify Installation

Run these checks:
- `cd apps/[name] && bun dev` - Ensure the app starts
- Check that Tailwind styles are applied
- If example component was added, verify it renders correctly

### 9. Report Results

Output using the format below.

## Output Format

ALWAYS use this structure:

- **App Updated**: `apps/[name]`
- **Stack Components Added**:
  - ✅ Component 1 (e.g., Tailwind CSS)
  - ✅ Component 2 (e.g., shadcn/ui)
  - (list all additions)
- **Files Modified**:
  - `file1.ts` - description of change
  - `file2.json` - description of change
- **Next Steps**:
  - Run `cd apps/[name] && bun dev` to test
  - Add shadcn components with `bunx shadcn@latest add [component]`
  - Review with `/vercel-react-best-practices`

## Usage

```
/update-syner-app [app-name]
```

Examples:
- `/update-syner-app notes` - Update the notes app
- `/update-syner-app` - Will prompt for app selection

## Common Patterns

### Adding Tailwind to existing Next.js app:
1. Install dependencies
2. Create `tailwind.config.ts`
3. Create/update `app/globals.css`
4. Import globals.css in `app/layout.tsx`

### Adding shadcn to existing Tailwind app:
1. Run shadcn init
2. Fix any path alias issues
3. Update global CSS if needed
4. Test with a sample component

## Error Handling

If errors occur during update:
- Check Node/Bun version compatibility
- Ensure all peer dependencies are satisfied
- Look for conflicting configurations
- Check if manual intervention is needed for complex migrations

## Notes

- Always backup or commit before major updates
- Some apps may need manual adjustments after automated updates
- The skill reads `common-stack.md` dynamically to stay current
- Use `git diff` to review all changes after update