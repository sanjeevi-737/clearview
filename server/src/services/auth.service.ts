import bcrypt from "bcryptjs";
import { ApiError } from "../utils/ApiError.js";
import { signToken } from "../utils/jwt.js";
import { userRepository } from "../repositories/user.repository.js";
import { toPublicUser } from "../models/user.model.js";
import type { RegisterInput, LoginInput } from "../validations/auth.schema.js";

function isDuplicateKeyError(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code?: unknown }).code === 11000
  );
}

export const authService = {
  async register(data: RegisterInput) {
    const exists = await userRepository.emailExists(data.email);
    if (exists) {
      throw new ApiError(409, "Email already exists");
    }

    const passwordHash = await bcrypt.hash(data.password, 12);
    try {
      const user = await userRepository.create({
        name: data.name,
        email: data.email,
        passwordHash,
      });

      const token = signToken({ userId: String(user._id), email: user.email });
      return { user: toPublicUser(user), token };
    } catch (err) {
      if (isDuplicateKeyError(err)) {
        throw new ApiError(409, "Email already exists");
      }
      throw err;
    }
  },

  async login(data: LoginInput) {
    const user = await userRepository.findByEmailWithPassword(data.email);
    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    const valid = await bcrypt.compare(data.password, user.password);
    if (!valid) {
      throw new ApiError(401, "Invalid email or password");
    }

    const token = signToken({ userId: String(user._id), email: user.email });
    return { user: toPublicUser(user), token };
  },

  logout() {
    return { message: "Logged out successfully" };
  },
};
