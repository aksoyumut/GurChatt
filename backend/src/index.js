import express from 'express';
import dotenv from 'dotenv';
import path from "path";
import cookieParser from 'cookie-parser';
import cors from "cors";

import { connectDB } from "./lib/db.js";
import authRoutes from "../src/routes/auth.route.js";
import messageRoutes from "../src/routes/message.route.js";
import { app, server, io , userSocketMap} from './lib/socket.js'; // io'yu da aldık
import { setupSocketEvents } from "./controllers/message.controller.js"; // socket eventleri için

dotenv.config();

const __dirname = path.resolve();
const PORT = process.env.PORT;

app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Sadece production ortamında statik dosyaları sun
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

// ✅ Socket.IO olaylarını burada başlat
setupSocketEvents(io , userSocketMap);

// Server başlat
server.listen(5001, () => {
  console.log('Server started on port:' + PORT);
  connectDB();
});
