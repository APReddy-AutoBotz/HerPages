import { describe, it, expect } from "vitest";
import { buildApp } from "../index.js";

describe("API health endpoint", () => {
  it("returns ok status", async () => {
    const app = await buildApp();
    const res = await app.inject({ method: "GET", url: "/health" });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.payload);
    expect(body.status).toBe("ok");
    expect(body.service).toBe("HerPages");
    expect(body.synthetic).toBe(true);
    await app.close();
  });
});
