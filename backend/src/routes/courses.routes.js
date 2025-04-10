import express from "express";

import { createCourse, getAllCourses } from "../controllers/courses.controllers.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getAllCourses); // Get all courses - no protection needed
router.post("/create", protectRoute, createCourse);

export default router;
