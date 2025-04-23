import express from "express";

import { createCourse, getAllCourses } from "../controllers/posts.controllers.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getAllPosts); // Get all courses - no protection needed
router.post("/create", protectRoute, createPost);

export default router;
