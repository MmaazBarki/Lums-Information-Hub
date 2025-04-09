import express from "express";
import { uploadResource, getResourcesByCourse } from "../controllers/academicResource.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, uploadResource); // Upload a new resource
router.get("/:course_code", getResourcesByCourse); // Get resources for a course

export default router;
