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

    const items = page.locator('[data-testid^="todo-item-"]');

    await input.fill("First todo");
    await submit.click();
    await expect(items).toHaveCount(1);

    await input.fill("Second todo");
    await submit.click();
    await expect(items).toHaveCount(2);

    await input.fill("Third todo");
    await submit.click();
    await expect(items).toHaveCount(3);

    await expect(page.getByText("First todo")).toBeVisible();
    await expect(page.getByText("Second todo")).toBeVisible();
    await expect(page.getByText("Third todo")).toBeVisible();
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
