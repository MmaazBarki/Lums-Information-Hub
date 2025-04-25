import express from "express";
import { toggleBookmark, getBookmarkedResources } from "../controllers/bookmark.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/:resourceId", protectRoute, toggleBookmark);

router.get("/", protectRoute, getBookmarkedResources);

export default router;