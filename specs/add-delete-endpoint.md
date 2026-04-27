# Spec: Add DELETE /todos/:id Endpoint

## Overview

Add a `DELETE /todos/:id` endpoint to remove a todo item by its ID.

## Requirements

### Endpoint

- **Method:** DELETE
- **Path:** `/todos/:id`
- **Authentication:** None required

### Behavior

- If a todo with the given ID exists: remove it from the list, return HTTP 204 (No Content) with no body
- If no todo with the given ID exists: return HTTP 404 with `{ "error": "Todo not found" }`

### Properties

- **Idempotent in status code:** Deleting a non-existent ID returns 404 consistently — it does not error or return 204
- **State change:** After successful deletion, the todo MUST NOT appear in `GET /todos` responses

## Acceptance Criteria

1. `DELETE /todos/:id` with a valid, existing ID returns 204 and empty body
2. `DELETE /todos/:id` with a non-existent ID returns 404 with error message
3. After deleting a todo, `GET /todos` does not include the deleted item
4. Deleting the same ID twice returns 404 on the second call
5. Other todos are unaffected by the deletion
6. All existing tests for GET and POST continue to pass

## Files to Modify

- `src/routes/todos.ts` — add DELETE handler
- `tests/todos.test.ts` — add tests for all acceptance criteria above

## Out of Scope

- Soft delete / archive
- Bulk delete
- Authentication / authorization
