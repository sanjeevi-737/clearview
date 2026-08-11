import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { env, isProduction } from "./config/env.js";
import { swaggerSpec } from "./config/swagger.js";
import apiRoutes from "./routes/index.js";
import { notFoundHandler, errorHandler } from "./middleware/error.js";
import { globalLimiter } from "./middleware/rateLimit.js";
import { logger } from "./utils/logger.js";

const app = express();

app.disable("x-powered-by");

app.use(helmet());
app.use(
  cors({
    origin: isProduction
      ? env.CLIENT_URL.split(",").map((o) => o.trim()).filter(Boolean)
      : true,
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(compression());
app.use(
  morgan("dev", {
    stream: { write: (message: string) => logger.http(message.trim()) },
  })
);
app.use(globalLimiter);

app.get("/health", (_req, res) => {
  res.json({ success: true, status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
