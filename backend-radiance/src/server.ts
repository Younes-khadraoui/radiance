import express from "express";
import http from "http";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { authRoutes } from "./routes/authRoutes";
import { setupSocket } from "./routes/socket";
import cors from "cors";

dotenv.config();

const app = express();
const server = http.createServer(app);
setupSocket(server);

const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: [process.env.ALLOWED_ORIGIN as string],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/auth", authRoutes);

mongoose.set("debug", true);
const { MONGODB_URI } = process.env;

mongoose.connect(MONGODB_URI as string);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB!");
});

app.get("/", (req, res) => {
  res.send("Welcome to radiance api!");
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
