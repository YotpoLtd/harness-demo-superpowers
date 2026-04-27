# Spec: Add DELETE /todos/:id Endpoint

## Why

The todo API currently supports creating and listing todos but has no way to remove them. Without a delete endpoint, the in-memory list grows indefinitely within a session. This is also the guided demo feature — it exercises the full harness pipeline (writing-plans → SDD → finishing) against a non-trivial but well-scoped change.

## What Changes

- Add `DELETE /todos/:id` route to the existing todo router
- Return 204 on successful deletion, 404 if the todo does not exist
- In-memory array updated immutably (filter, not splice)

## Functional Requirements

1. The API SHALL accept `DELETE /todos/:id` where `:id` is a UUID string
2. If a todo with the given ID exists, the API SHALL remove it and return HTTP 204 with no body
3. If no todo with the given ID exists, the API SHALL return HTTP 404 with `{ "error": "Todo not found" }`
4. The deletion MUST be reflected in subsequent `GET /todos` responses
5. Deletion of one todo MUST NOT affect other todos in the list
6. The endpoint SHALL be idempotent in status code — deleting a non-existent ID consistently returns 404

## Acceptance Criteria

1. Given a todo exists, when `DELETE /todos/:id` is called with its ID, then the response status is 204 and body is empty
2. Given no todo with that ID exists, when `DELETE /todos/:id` is called, then the response status is 404 with an error message
3. Given a todo was deleted, when `GET /todos` is called, then the deleted todo does not appear in the list
4. Given a todo was already deleted, when `DELETE /todos/:id` is called again with the same ID, then the response status is 404
5. Given multiple todos exist, when one is deleted, then all other todos remain unchanged in `GET /todos`
6. All existing tests for GET and POST endpoints continue to pass

## Affected Files

- Modify: `src/routes/todos.ts` — add DELETE handler to the existing router
- Modify: `tests/todos.test.ts` — add tests for all acceptance criteria above

## Out of Scope

- Soft delete / archive
- Bulk delete
- Authentication / authorization
- Request body validation (DELETE has no body)
