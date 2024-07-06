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

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

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
db.once("open", () => {
  console.log("Connected to MongoDB!");
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

const io = new SocketServer(server, {
  cors: {
    origin: process.env.ALLOWED_ORIGIN as string,
    methods: ["GET", "POST"],
  },
});

startApolloServer()
  .then(() => {
    io.on("connection", async (socket) => {
      console.log("New client connected");

      const messages = await Message.find().sort({ timestamp: -1 }).limit(50);
      socket.emit("initMessages", messages);

      socket.on("message", async (message) => {
        try {
          const newMessage = new Message({
            username: message.username,
            message: message.message,
            timestamp: new Date(),
            email: message.email,
          });

          await newMessage.save();

          io.emit("message", message);
          console.log("Message received and saved:", message);
        } catch (error) {
          console.error("Error saving message to MongoDB:", error);
        }
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected");
      });
    });

    server.listen(PORT, () =>
      console.log(`Server running at http://localhost:${PORT}`)
    );
  })
  .catch((error) => {
    console.error("Error starting Apollo Server:", error);
  });
