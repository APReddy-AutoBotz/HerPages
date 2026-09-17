import type { FastifyInstance } from "fastify";
import { brand } from "@herpages/design-tokens";

export async function healthRoutes(app: FastifyInstance) {
  app.get("/health", async () => {
    return {
      status: "ok",
      service: brand.name,
      environment: "development",
      synthetic: true,
    };
  });
}
