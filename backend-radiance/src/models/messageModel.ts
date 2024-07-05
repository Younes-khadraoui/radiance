import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  message: string;
  username: string;
  timestamp: Date;
}

const messageSchema: Schema<IMessage> = new mongoose.Schema({
  message: { type: String, required: true },
  username: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export const Message = mongoose.model<IMessage>("Message", messageSchema);
