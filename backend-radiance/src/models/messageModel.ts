import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  message: string;
  username?: string;
  timestamp: Date;
  email: string;
  profilePic?: string;
}

const messageSchema: Schema<IMessage> = new mongoose.Schema({
  message: { type: String, required: true },
  username: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  email: { type: String, required: true },
  profilePic: { type: String, default: "" },
});

export const Message = mongoose.model<IMessage>("Message", messageSchema);
