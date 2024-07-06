import { Server } from "socket.io";
import { IMessage, Message } from "../models/messageModel";

export function setupSocket(server: any) {
  const io = new Server(server, {
    cors: {
      origin: process.env.ALLOWED_ORIGIN,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", async (socket) => {
    try {
      const messages = await Message.find()
        .sort({ timestamp: -1 })
        .limit(20)
        .lean();
      socket.emit("initMessages", messages);

      socket.on("message", async (message: IMessage) => {
        try {
          const newMessage = new Message({
            message: message.message,
            username: message.username,
            email: message.email,
            profilePic: message.profilePic,
            timestamp: new Date(),
          });
          await newMessage.save();

          io.emit("message", newMessage);
        } catch (error) {
          console.error("Error saving message:", error);
        }
      });
    } catch (error) {
      console.error("Error fetching messages:", error);
    }

    socket.on("disconnect", () => {
      console.log("user disconnected", socket.id);
    });
  });
}
