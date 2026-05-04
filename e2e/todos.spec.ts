import { test, expect } from "@playwright/test";

test.describe("Todo App", () => {
  test.beforeEach(async ({ page, request }) => {
    // Clear all todos before each test to ensure isolation
    const todos = await request.get("/todos");
    expect(todos.ok()).toBeTruthy();
    const todoList = await todos.json();
    for (const todo of todoList) {
      const deleted = await request.delete(`/todos/${todo.id}`);
      expect(deleted.ok()).toBeTruthy();
    }
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

    const emptyState = page.locator('[data-testid="todo-empty"]');
    await expect(emptyState).toBeVisible();
  });
});
