# Workflows

## Export Guidelines

**DO NOT use `export * from './module'` patterns.**

Always use explicit named exports for better:
- Tree-shaking
- Type inference  
- Code readability
- Build optimization

## Pattern

Each workflow file exports:
- Interfaces for agents and config
- Class implementing `Workflow<T>` from `@syner/sdk`

Example:
```typescript
export interface {Name}Agents { ... }
export interface {Name}Config { ... }
export class {Name}Workflow<T> implements Workflow<T> { ... }
```
