import express, { json } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import mongoose from "mongoose";
import router from './Routes/userRoute.js';
import chatrouter from './Routes/chatRoute.js';
import messagerouter from "./Routes/messageRoute.js";
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 5000;
const URI = process.env.ATLAS_URI;

// Express middleware
app.use(express.json());
app.use(cors());
app.use('/api/users', router);
app.use('/api/chat', chatrouter);
app.use('/api/messages', messagerouter);

// Socket.io logic
let onlineUsers = [];

io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);
    socket.emit("onlineUsers", onlineUsers);

    socket.on("addNewUser", (userId) => {
        if (!userId || onlineUsers.some((user) => user.userId === userId)) return;
        onlineUsers.push({ userId, socket: socket.id });
        io.emit("onlineUsers", onlineUsers);
    });

    socket.on("sendMessage", (message) => {
        const user = onlineUsers.find(u => u.userId === message.recipientId);
        if (user) {
            io.to(user.socket).emit("getMessage", message);
            io.to(user.socket).emit("getNotification", {
                senderId: message.senderId,
                chatId: message.chatId,
                isRead: false,
                date: new Date()
            });
        }
    });

    socket.on("disconnect", () => {
        console.log(`Socket disconnected: ${socket.id}`);
        onlineUsers = onlineUsers.filter(user => user.socket !== socket.id);
        io.emit("onlineUsers", onlineUsers);
    });
});

// Routes
app.get("/", (req, res) => {
    res.send("Welcome to ChatApp Server");
});

// Database connection
mongoose.connect(URI).then(() => {
    console.log("MongoDB connection established");
}).catch((error) => console.log("MongoDB connection failed:", error.message));

// Start combined server
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Socket.io connected to same port`);
});