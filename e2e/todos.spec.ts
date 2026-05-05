import { test, expect } from "@playwright/test";

test.describe("Todo App", () => {
  test.beforeEach(async ({ page, request }) => {
    // Clear all todos before each test — fail if cleanup cannot complete (shared dev server state).
    const todos = await request.get("/todos");
    expect(todos.ok(), `GET /todos failed with status ${todos.status()}`).toBeTruthy();

    let todoList: unknown;
    try {
      todoList = await todos.json();
    } catch (err) {
      throw new Error(`GET /todos returned invalid JSON: ${String(err)}`);
    }
    expect(Array.isArray(todoList), "GET /todos must return a JSON array").toBeTruthy();

    for (const todo of todoList as unknown[]) {
      if (typeof todo !== "object" || todo === null) {
        continue;
      }
      const id = "id" in todo ? (todo as { id: unknown }).id : undefined;
      if (typeof id !== "string") {
        continue;
      }
      const del = await request.delete(`/todos/${id}`);
      expect(
        del.ok(),
        `DELETE /todos/${id} failed with status ${del.status()}`,
      ).toBeTruthy();
    }

    const verify = await request.get("/todos");
    expect(verify.ok(), `Verify GET /todos failed with status ${verify.status()}`).toBeTruthy();
    const remaining = await verify.json();
    expect(Array.isArray(remaining), "Verify GET /todos must return a JSON array").toBeTruthy();
    expect((remaining as unknown[]).length).toBe(0);

    await page.goto("/");
  });

  test("page loads with empty state", async ({ page }) => {
    const emptyState = page.locator('[data-testid="todo-empty"]');
    await expect(emptyState).toBeVisible();
    await expect(emptyState).toHaveText("No todos yet");

    const todoList = page.locator('[data-testid="todo-list"]');
    await expect(todoList).toBeEmpty();
  });

  test("create a todo", async ({ page }) => {
    const input = page.locator('[data-testid="todo-input"]');
    const submit = page.locator('[data-testid="todo-submit"]');

    await input.fill("Buy groceries");
    await submit.click();

    const todoItems = page.locator('[data-testid^="todo-item-"]');
    await expect(todoItems).toHaveCount(1);
    await expect(todoItems.first()).toContainText("Buy groceries");

    const emptyState = page.locator('[data-testid="todo-empty"]');
    await expect(emptyState).toBeHidden();
  });

  test("create multiple todos", async ({ page }) => {
    const input = page.locator('[data-testid="todo-input"]');
    const submit = page.locator('[data-testid="todo-submit"]');

    await input.fill("First todo");
    await submit.click();
    await page.locator('[data-testid^="todo-item-"]').first().waitFor();

    await input.fill("Second todo");
    await submit.click();
    await expect(page.locator('[data-testid^="todo-item-"]')).toHaveCount(2);

    await input.fill("Third todo");
    await submit.click();
    await expect(page.locator('[data-testid^="todo-item-"]')).toHaveCount(3);

    const items = page.locator('[data-testid^="todo-item-"]');
    await expect(items.nth(0)).toContainText("First todo");
    await expect(items.nth(1)).toContainText("Second todo");
    await expect(items.nth(2)).toContainText("Third todo");
  });

  test("delete a todo", async ({ page }) => {
    const input = page.locator('[data-testid="todo-input"]');
    const submit = page.locator('[data-testid="todo-submit"]');

    await input.fill("Todo to delete");
    await submit.click();

    const todoItem = page.locator('[data-testid^="todo-item-"]').first();
    await todoItem.waitFor();

    const deleteButton = page.locator('[data-testid^="todo-delete-"]').first();
    await deleteButton.click();

    await expect(page.locator('[data-testid^="todo-item-"]')).toHaveCount(0);

    const emptyState = page.locator('[data-testid="todo-empty"]');
    await expect(emptyState).toBeVisible();
  });

  test("empty input does not create a todo", async ({ page }) => {
    const submit = page.locator('[data-testid="todo-submit"]');

    await submit.click();

    const todoItems = page.locator('[data-testid^="todo-item-"]');
    await expect(todoItems).toHaveCount(0);

    const emptyState = page.locator('[data-testid="todo-empty"]');
    await expect(emptyState).toBeVisible();
  });

  test("whitespace-only input does not create a todo", async ({ page }) => {
    const input = page.locator('[data-testid="todo-input"]');
    const submit = page.locator('[data-testid="todo-submit"]');

    await input.fill("   ");
    await submit.click();

    const todoItems = page.locator('[data-testid^="todo-item-"]');
    await expect(todoItems).toHaveCount(0);
  });
});
