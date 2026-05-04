import { Router } from "express";
import type { Todo } from "../types.js";

function validateTitle(input?: unknown): { valid: boolean; error?: string } {
  if (!input || typeof input !== "string" || input.trim().length === 0) {
    return { valid: false, error: "title is required" };
  }
  return { valid: true };
}

export function createTodoRouter(): {
  router: Router;
  getTodos: () => readonly Todo[];
} {
  let todos: readonly Todo[] = [];

  const router = Router();

  router.get("/", (_req, res): void => {
    res.json(todos);
  });

  router.post("/", (req, res): void => {
    const { title } = req.body as { title?: string };

    const titleValidation = validateTitle(title);
    if (!titleValidation.valid) {
      res.status(400).json({ error: titleValidation.error });
      return;
    }

    const todo: Todo = {
      id: crypto.randomUUID(),
      title: (title as string).trim(),
      completed: false,
    };

    todos = [...todos, todo];
    res.status(201).json(todo);
  });

  router.delete("/:id", (req, res): void => {
    const { id } = req.params;
    const existing = todos.find((todo) => todo.id === id);

    if (!existing) {
      res.status(404).json({ error: "Todo not found" });
      return;
    }

    todos = todos.filter((todo) => todo.id !== id);
    res.status(204).send();
  });

  router.patch("/:id", (req, res): void => {
    const { id } = req.params;
    const { title: newTitle, completed: newCompleted } = req.body as {
      title?: string;
      completed?: boolean;
    };

    // Validate title if provided
    if (newTitle !== undefined) {
      const titleValidation = validateTitle(newTitle);
      if (!titleValidation.valid) {
        res.status(400).json({ error: titleValidation.error });
        return;
      }
    }

    // Find existing todo
    const existing = todos.find((todo) => todo.id === id);
    if (!existing) {
      res.status(404).json({ error: "Todo not found" });
      return;
    }

    // Apply updates immutably
    const updated: Todo = {
      id: existing.id,
      title: newTitle !== undefined ? newTitle.trim() : existing.title,
      completed: newCompleted !== undefined ? newCompleted : existing.completed,
    };

    todos = todos.map((todo) => (todo.id === id ? updated : todo));
    res.status(200).json(updated);
  });

  return { router, getTodos: () => todos };
}
