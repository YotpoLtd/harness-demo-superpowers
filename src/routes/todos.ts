import { Router } from "express";
import type { Todo } from "../types.js";

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

    if (!title || typeof title !== "string" || title.trim().length === 0) {
      res.status(400).json({ error: "title is required" });
      return;
    }

    const todo: Todo = {
      id: crypto.randomUUID(),
      title: title.trim(),
      completed: false,
    };

    todos = [...todos, todo];
    res.status(201).json(todo);
  });

  return { router, getTodos: () => todos };
}
