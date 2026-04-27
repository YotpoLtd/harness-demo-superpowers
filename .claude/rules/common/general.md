# General Coding Standards

## Immutability

ALWAYS create new objects. NEVER mutate existing ones.
Use spread operators, `Array.prototype.map`, `Array.prototype.filter` — never `.push()`, `.splice()`, or direct property assignment on existing objects.

## File Organization

- One module per file, one responsibility per module
- 200-400 lines typical, 800 max
- Organize by feature/domain, not by type

## Error Handling

- Handle errors explicitly at every level
- Return structured error responses: `{ error: "message" }`
- Never silently swallow errors
- Log server-side errors with context

## No Placeholders

NEVER write:
- `// TODO: implement later`
- `throw new Error("Not implemented")`
- Empty function bodies
- Stub implementations that compile but don't work

Every function must be fully implemented or not written at all.
