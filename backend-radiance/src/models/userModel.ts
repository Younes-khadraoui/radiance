import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  username?: string;
  profilePic?: string;
  admin: boolean;
}

const userSchema: Schema<IUser> = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, default: "" },
  profilePic: { type: String, default: "" },
  admin: { type: Boolean, default: false },
});

export const User = mongoose.model<IUser>("User", userSchema);
