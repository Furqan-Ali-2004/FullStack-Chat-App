import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["https://fullstack-chat-app-1-9c4w.onrender.com"],
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// Used to store online users and their socket IDs
const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  // io.emit() is used to send events to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });

  // Handle other socket events here
});

export { io, app, server };
