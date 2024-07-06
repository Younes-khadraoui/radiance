import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  messages: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      message: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

export const Group = mongoose.model("Group", groupSchema);
