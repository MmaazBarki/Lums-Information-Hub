import dotenv from "dotenv";
dotenv.config();

import express from "express";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import { app, server } from "./lib/socket.js";
import { connect } from "mongoose";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import academicResourceRoutes from "./routes/academicResource.routes.js";
import courseRoutes from "./routes/courses.routes.js";
import postRoutes from "./routes/posts.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import bookmarkRoutes from "./routes/bookmark.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import { configureCloudinary } from "./lib/cloudinary.js";
import otpRoutes from "./routes/otp.routes.js";
import resetPasswordRoutes from "./routes/resetPassword.routes.js";

dotenv.config();

configureCloudinary();

const PORT = process.env.PORT
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  }));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

app.use("/api/resources", academicResourceRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/posts", postRoutes); 
app.use("/api/admin", adminRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/profile", profileRoutes);

app.use("/api/otp", otpRoutes);
app.use("/api/auth/reset", resetPasswordRoutes);

server.listen(PORT, ()=>{
    console.log("server is running on port: "+ PORT);
    connectDB()
});