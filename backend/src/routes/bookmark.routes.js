import express from "express";
import { toggleBookmark, getBookmarkedResources } from "../controllers/bookmark.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Toggle bookmark on a resource (add/remove)
router.post("/:resourceId", protectRoute, toggleBookmark);

// Get all bookmarked resources for the logged-in user
router.get("/", protectRoute, getBookmarkedResources);

export default router;