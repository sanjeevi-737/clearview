import type { Request, Response, NextFunction, RequestHandler } from "express";
import type { ZodType } from "zod";
import { ApiError } from "../utils/ApiError.js";

type Sources = "body" | "params" | "query";

export function validate(schema: ZodType, source: Sources = "body"): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));
      next(new ApiError(422, "Validation failed", errors));
      return;
    }
    req[source] = result.data;
    next();
  };
}
