import express from "express";
import http from "http";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { ApolloServer } from "apollo-server-express";
import typeDefs from "./graphql/schema";
import resolvers from "./graphql/resolvers";
import cors from "cors";
import { Server as SocketServer } from "socket.io";
import { contextMiddleware } from "./middlewares/contextMiddleware";
import { Message } from "./models/messageModel";
import { Group } from "./models/groupModel";
import { User } from "./models/userModel";

dotenv.config();

const app = express();
const httpServer = http.createServer(app);

const PORT = process.env.PORT || 5000;
const GLOBAL_GROUP = "Global Group";

console.log("Allowed Origin:", process.env.ALLOWED_ORIGIN);

const corsOptions = {
  origin: [process.env.ALLOWED_ORIGIN as string],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI as string);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", async () => {
  console.log("Connected to MongoDB!");

  const globalGroup = await Group.findOne({ name: GLOBAL_GROUP });
  if (!globalGroup) {
    const newGlobalGroup = new Group({
      name: GLOBAL_GROUP,
      users: [],
    });
    await newGlobalGroup.save();
    console.log("Global Group created in MongoDB.");
  }
});

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: contextMiddleware,
});

async function startApolloServer() {
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });
}

const io = new SocketServer(httpServer, {
  cors: {
    origin: process.env.ALLOWED_ORIGIN as string,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
});

io.on("connection", async (socket) => {
  console.log("New client connected");

  socket.on("joinGroup", async (groupName) => {
    console.log(`Joining group: ${groupName}`);
    try {
      socket.join(groupName);
      const groupMessages = await Message.find({ group: groupName })
        .sort({ timestamp: -1 })
        .limit(50);

      socket.emit("groupMessages", groupMessages.reverse());
    } catch (error) {
      console.error(`Error joining group '${groupName}':`, error);
    }
  });

  socket.on("createGroup", async (groupName) => {
    try {
      const group = new Group({ name: groupName, users: [] });
      await group.save();
      socket.join(groupName);
      socket.emit("groupCreated", group);
    } catch (error) {
      console.error(`Error creating group '${groupName}':`, error);
    }
  });

  socket.on("message", async (message) => {
    console.log("Message received:", message);
    try {
      const { username, message: msg, email, group } = message;

      const newMessage = new Message({
        username: username,
        message: msg,
        timestamp: new Date(),
        email: email,
        group: group || GLOBAL_GROUP,
      });

      await newMessage.save();

      io.to(group).emit("message", {
        ...message,
        timestamp: newMessage.timestamp.toLocaleString(),
      });
    } catch (error) {
      console.error("Error saving message to MongoDB:", error);
    }
  });

  socket.on("userConnected", async ({ username, socketId }) => {
    console.log("User connected:", username);
    try {
      const user = await User.findOneAndUpdate(
        { username: username },
        { socketId: socketId, online: true },
        { new: true }
      );

      if (!user) {
        console.log("User with username not found.");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
    try {
      const updatedUser = await User.findOneAndUpdate(
        { username: username },
        { online: true },
        { new: true }
      );
      if (!updatedUser) {
        console.error(`User with username ${username} not found.`);
      }
    } catch (error) {
      console.error("Error updating user online status:", error);
    }
  });

  socket.on("userDisconnect", async () => {
    console.log("Client disconnected");
    console.log("Socket ID:", socket.id);
    await User.findOneAndUpdate({ socketId: socket.id }, { online: false });
  });

  socket.on("initMessages", async (groupName) => {
    try {
      const messages = await Message.find({ group: groupName })
        .sort({ timestamp: -1 })
        .limit(50);
      socket.emit("initMessages", messages);
    } catch (error) {
      console.error(
        `Error fetching initial messages for group '${groupName}':`,
        error
      );
    }
  });
});

httpServer.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);

startApolloServer().catch((error) => {
  console.error("Error starting Apollo Server:", error);
});
