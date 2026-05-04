import path from "node:path";
import express, { type Express } from "express";
import { createTodoRouter } from "./routes/todos.js";

export function createApp(): Express {
  const app = express();
  app.use(express.json());
  app.use(express.static(path.join(import.meta.dirname, "..", "public")));

  const { router } = createTodoRouter();
  app.use("/todos", router);

  return app;
}

function startServer(): void {
  const app = createApp();
  const port = process.env["PORT"] ?? 3000;

  app.listen(port, () => {
    console.log(`Harness Demo API running on http://localhost:${port}`);
  });
}

const isDirectRun = Boolean(
  process.argv[1] &&
    import.meta.url.endsWith(process.argv[1].replace(/\\/g, "/"))
);

if (isDirectRun) {
  startServer();
}
