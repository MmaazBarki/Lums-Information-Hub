import express from "express";
import { uploadResource, getResourcesByCourse, addOrUpdateRating, incrementDownloadCount, getAllResources } from "../controllers/academicResource.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js"
import multer from "multer";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/upload", protectRoute, upload.single('resourceFile'), uploadResource);
router.get("/all", getAllResources);
router.get("/:course_code", getResourcesByCourse);
router.post("/:resourceId/rate", protectRoute, addOrUpdateRating);
router.post("/:resourceId/download", protectRoute, incrementDownloadCount);

export default router;
