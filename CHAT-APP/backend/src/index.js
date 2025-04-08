import express from "express";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js"; // Faraz
import { app, server } from "./lib/socket.js"; // Faraz: Socket.io server
import dotenv from "dotenv";
import { connect } from "mongoose";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";

dotenv.config();


const PORT = process.env.PORT

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes)
app.use("/api/message", messageRoutes) // Faraz: Message Routes


server.listen(PORT, ()=>{
    console.log("server is running on port: "+ PORT);
    connectDB()
});