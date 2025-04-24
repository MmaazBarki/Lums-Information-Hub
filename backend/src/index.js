import dotenv from "dotenv";
dotenv.config(); // Load environment variables FIRST

import express from "express";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js"; // Faraz
import { app, server } from "./lib/socket.js"; // Faraz: Socket.io server
import { connect } from "mongoose";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import academicResourceRoutes from "./routes/academicResource.routes.js";
import courseRoutes from "./routes/courses.routes.js";
import postRoutes from "./routes/posts.routes.js";
import { configureCloudinary } from "./lib/cloudinary.js"; // Import the configuration function

// Configure Cloudinary after dotenv has loaded
configureCloudinary();

const PORT = process.env.PORT
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],  // Your frontend URLs
    credentials: true,  // Allow cookies and credentials
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  }));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes); // Faraz: Message Routes

app.use("/api/resources", academicResourceRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/posts", postRoutes); 

server.listen(PORT, ()=>{
    console.log("server is running on port: "+ PORT);
    connectDB()
});