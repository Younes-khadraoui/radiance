import { Server } from "socket.io";
import { IMessage, Message } from "../models/messageModel"; // Adjust the path as needed

export function setupSocket(server: any) {
  const io = new Server(server, {
    cors: {
      origin: process.env.ALLOWED_ORIGIN,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("a user connected", socket.id);

    socket.on("message", async (message: IMessage) => {
      try {
        const newMessage = new Message({
          content: message.message,
          sender: message.username,
        });
        await newMessage.save();
        io.emit("message", message);
      } catch (error) {
        console.error("Error saving message:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("user disconnected", socket.id);
    });
  });
}
