import express from "express";
import { uploadResource, getResourcesByCourse, addOrUpdateRating, incrementDownloadCount, getAllResources } from "../controllers/academicResource.controller.js"; // Added getAllResources
import { protectRoute } from "../middleware/auth.middleware.js"
import multer from "multer"; // Import multer

const router = express.Router();

// Configure multer for memory storage (to get buffer for Cloudinary)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/upload", protectRoute, upload.single('resourceFile'), uploadResource); // Use multer middleware for single file upload named 'resourceFile'
router.get("/all", getAllResources); // New route to get all resources
router.get("/:course_code", getResourcesByCourse); // Get resources for a course
router.post("/:resourceId/rate", protectRoute, addOrUpdateRating); // Route to add/update rating
router.post("/:resourceId/download", protectRoute, incrementDownloadCount); // Route to increment download count

export default router;
