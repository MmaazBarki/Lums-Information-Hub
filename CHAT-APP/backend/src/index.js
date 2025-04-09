import express from "express";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js"; // Faraz
import { app, server } from "./lib/socket.js"; // Faraz: Socket.io server
import dotenv from "dotenv";
import { connect } from "mongoose";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import academicResourceRoutes from "./routes/academicResource.routes.js";
// import courseRoutes from "./routes/course.routes.js"; // optional


dotenv.config();


const PORT = process.env.PORT
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],  // Your frontend URLs
    credentials: true,  // Allow cookies and credentials
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  }));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes)
app.use("/api/message", messageRoutes) // Faraz: Message Routes

app.use("/api/resources", academicResourceRoutes);
// app.use("/api/courses", courseRoutes); // optional, if you want API to create/read courses


server.listen(PORT, ()=>{
    console.log("server is running on port: "+ PORT);
    connectDB()
});