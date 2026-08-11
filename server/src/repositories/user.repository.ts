import { User, type UserDocument } from "../models/user.model.js";

type CreateUserInput = {
  name: string;
  email: string;
  passwordHash: string;
};

export const userRepository = {
  async findByEmail(email: string): Promise<UserDocument | null> {
    return User.findOne({ email });
  },

  async findById(id: string): Promise<UserDocument | null> {
    return User.findById(id);
  },

  async findByIdWithPassword(id: string): Promise<UserDocument | null> {
    return User.findById(id).select("+password");
  },

  async findByEmailWithPassword(email: string): Promise<UserDocument | null> {
    return User.findOne({ email }).select("+password");
  },

  async emailExists(email: string): Promise<boolean> {
    return (await User.exists({ email })) !== null;
  },

  async create({ name, email, passwordHash }: CreateUserInput): Promise<UserDocument> {
    return User.create({ name, email, password: passwordHash });
  },

  async setPassword(id: string, passwordHash: string): Promise<void> {
    await User.updateOne({ _id: id }, { $set: { password: passwordHash } });
  },
};
