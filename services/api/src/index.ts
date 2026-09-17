import Fastify from "fastify";
import { healthRoutes } from "./routes/health.js";

export async function buildApp() {
  const app = Fastify({
    logger: true,
  });

  app.register(healthRoutes);

  return app;
}

async function start() {
  const app = await buildApp();
  const port = parseInt(process.env["API_PORT"] ?? "3001", 10);
  const host = process.env["API_HOST"] ?? "0.0.0.0";

  await app.listen({ port, host });
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
