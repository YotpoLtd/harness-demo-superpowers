# TypeScript Conventions

## Strict Mode

`tsconfig.json` has `strict: true`. This means:
- No implicit `any` — every variable and parameter must have a type
- No implicit returns — every code path must return
- Strict null checks — handle `null` and `undefined` explicitly

## Type Definitions

- All shared types go in `src/types.ts`
- Use `interface` for object shapes, `type` for unions and intersections
- Mark all interface properties as `readonly` unless mutation is required
- Export all types — no default exports

## Express Patterns

- Use factory functions (`createApp()`, `createTodoRouter()`) — not global singletons
- Parse request body with explicit type assertion: `req.body as { field?: Type }`
- Validate all request input before processing
- Return appropriate HTTP status codes with JSON bodies

## Import Style

- Use named imports: `import { Router } from "express"`
- Use `.js` extension in imports (Node16 module resolution)
- Group imports: external libs first, then internal modules
