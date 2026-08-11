import app from "./app.js";
import { env } from "./config/env.js";
import { connectDatabase, disconnectDatabase } from "./config/database.js";
import { logger } from "./utils/logger.js";
import { demoService } from "./services/demo.service.js";

async function start(): Promise<void> {
  try {
    await connectDatabase();
    await demoService.ensureDemoUser().catch((err) => {
      logger.warn("Demo user bootstrap skipped", {
        error: err instanceof Error ? err.message : String(err),
      });
    });

    const server = app.listen(env.PORT, () => {
      logger.info(`ClearView AI API running on port ${env.PORT} (${env.NODE_ENV})`);
      logger.info(`API base: http://localhost:${env.PORT}/api`);
      logger.info(`Swagger docs: http://localhost:${env.PORT}/api-docs`);
    });

    const shutdown = (signal: string) => {
      logger.info(`${signal} received — shutting down gracefully`);
      server.close(async () => {
        await disconnectDatabase();
        process.exit(0);
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (err) {
    logger.error("Failed to start server", {
      error: err instanceof Error ? err.stack : String(err),
    });
    process.exit(1);
  }
}

void start();
