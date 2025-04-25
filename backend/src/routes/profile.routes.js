import express from "express";
import { uploadProfilePicture, removeProfilePicture, getProfilePicture } from "../controllers/profile.controllers.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/profile-picture/:userId", protectRoute, uploadProfilePicture);
router.delete("/profile-picture/:userId", protectRoute, removeProfilePicture);
router.get("/profile-picture/:userId", getProfilePicture);

export default router;