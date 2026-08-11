import winston from "winston";
import { env, isProduction } from "../config/env.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logDir = path.resolve(__dirname, "../../logs");
fs.mkdirSync(logDir, { recursive: true });

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr =
      meta && Object.keys(meta).length > 0
        ? ` ${JSON.stringify(meta)}`
        : "";
    return `${timestamp} [${level}]: ${message}${metaStr}`;
  })
);

export const logger = winston.createLogger({
  level: env.NODE_ENV === "development" ? "debug" : "info",
  transports: [
    new winston.transports.Console({ format: consoleFormat }),
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
      maxsize: 5_000_000,
      maxFiles: 5,
      format: winston.format.json(),
    }),
    new winston.transports.File({
      filename: path.join(logDir, "combined.log"),
      maxsize: 5_000_000,
      maxFiles: 5,
      format: winston.format.json(),
    }),
  ],
});

export function createHttpLogger(): winston.Logger {
  const stream = {
    write: (message: string) => logger.info(message.trim()),
  };
  return stream as unknown as winston.Logger;
}

export function logStartup(port: number): void {
  if (!isProduction) {
    logger.info(
      `ClearView AI server running at http://localhost:${port} (${env.NODE_ENV})`
    );
    logger.info(`Swagger docs at http://localhost:${port}/api-docs`);
  }
}
