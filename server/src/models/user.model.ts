import { Schema, model, type InferSchemaType } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [80, "Name cannot exceed 80 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export type UserDocument = InferSchemaType<typeof userSchema> & {
  _id: import("mongoose").Types.ObjectId;
};

export function toPublicUser(user: {
  _id: unknown;
  name: string;
  email: string;
  createdAt?: unknown;
}) {
  return {
    _id: String(user._id),
    name: user.name,
    email: user.email,
    createdAt: user.createdAt ?? null,
  };
}

export const User = model("User", userSchema);
