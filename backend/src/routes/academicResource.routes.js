import express from "express";
import { uploadResource, getResourcesByCourse } from "../controllers/academicResource.controller.js";
// import protect from "../middleware/auth.middleware.js";
import { protectRoute } from "../middleware/auth.middleware.js"

const router = express.Router();

router.post("/", protectRoute, uploadResource); // Upload a new resource
router.get("/:course_code", getResourcesByCourse); // Get resources for a course

export default router;
