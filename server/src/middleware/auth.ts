import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";
import { ApiError } from "../utils/ApiError.js";

export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      throw new ApiError(401, "Authentication required");
    }

    const token = header.slice("Bearer ".length).trim();
    const payload = verifyToken(token);
    req.user = { id: payload.userId, email: payload.email };
    next();
  } catch (err) {
    const message =
      err instanceof Error && err.name === "TokenExpiredError"
        ? "Session expired, please log in again"
        : "Invalid or expired token";
    next(new ApiError(401, message));
  }
}
