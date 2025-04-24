import express from "express";
import { uploadResource, getResourcesByCourse } from "../controllers/academicResource.controller.js";
// import protect from "../middleware/auth.middleware.js";
import { protectRoute } from "../middleware/auth.middleware.js"
import multer from "multer"; // Import multer

const router = express.Router();

// Configure multer for memory storage (to get buffer for Cloudinary)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/upload", protectRoute, upload.single('resourceFile'), uploadResource); // Use multer middleware for single file upload named 'resourceFile'
router.get("/:course_code", getResourcesByCourse); // Get resources for a course

export default router;
