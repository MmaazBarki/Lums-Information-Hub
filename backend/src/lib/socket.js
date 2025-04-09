import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173'],
    },
});
export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}
const userSocketMap = {};
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    const userId = socket.handshake.query.userId; // Get userId from the query parameters
    if (userId) userSocketMap[userId] = socket.id; // Map userId to socket id
    io.emit('getOnlineUsers', Object.keys(userSocketMap)); // Emit the online users to all clients
    // // Listen for incoming messages
    // socket.on('sendMessage', (message) => {
    //     console.log('Message received:', message);
    //     // Broadcast the message to all connected clients
    //     io.emit('receiveMessage', message);
    // });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));        
    });
});
export {io, app, server};
