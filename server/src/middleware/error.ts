import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";
import { logger } from "../utils/logger.js";
import { isProduction } from "../config/env.js";
import { MongooseError } from "mongoose";

export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  let statusCode = 500;
  let message = "Internal server error";
  let errors: unknown[] | undefined;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  } else if (err instanceof MongooseError) {
    statusCode = 500;
    message = "Database error";
  } else if (err instanceof Error) {
    message = err.message;
  }

  if (statusCode >= 500) {
    logger.error(`${req.method} ${req.originalUrl} -> ${statusCode}`, {
      message,
      stack: err instanceof Error ? err.stack : undefined,
    });
  } else {
    logger.warn(`${req.method} ${req.originalUrl} -> ${statusCode}: ${message}`);
  }

  res.status(statusCode).json({
    success: false,
    message: isProduction && statusCode >= 500 ? "Internal server error" : message,
    errors,
  });
}
