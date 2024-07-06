import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  message: string;
  username?: string;
  timestamp: Date;
  email: string;
  profilePic?: string;
  group: string;
}

const messageSchema: Schema<IMessage> = new mongoose.Schema({
  message: { type: String, required: true },
  username: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  email: { type: String, required: true },
  profilePic: { type: String, default: "" },
  group: { type: String, required: true },
});

export const Message = mongoose.model<IMessage>("Message", messageSchema);
