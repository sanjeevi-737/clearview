import type { AuthRequestUser } from "./index.js";

declare global {
  namespace Express {
    interface Request {
      user?: AuthRequestUser;
    }
  }
}

export {};
