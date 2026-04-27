import { describe, it, expect } from "vitest";
import supertest from "supertest";
import { createApp } from "../src/index.js";

describe("GET /todos", () => {
  it("returns empty array initially", async () => {
    const app = createApp();
    const response = await supertest(app).get("/todos");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
});

describe("POST /todos", () => {
  it("creates a todo and returns it with id", async () => {
    const app = createApp();
    const response = await supertest(app)
      .post("/todos")
      .send({ title: "Buy milk" })
      .set("Content-Type", "application/json");

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      title: "Buy milk",
      completed: false,
    });
    expect(response.body.id).toBeDefined();
  });

  it("returns 400 when title is missing", async () => {
    const app = createApp();
    const response = await supertest(app)
      .post("/todos")
      .send({})
      .set("Content-Type", "application/json");

    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });
});

describe("POST then GET", () => {
  it("created todo appears in list", async () => {
    const app = createApp();

    await supertest(app)
      .post("/todos")
      .send({ title: "Buy milk" })
      .set("Content-Type", "application/json");

    const response = await supertest(app).get("/todos");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].title).toBe("Buy milk");
  });
});
