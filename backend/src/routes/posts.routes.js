import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createPost, getAllPosts, updatePostLikes } from "../controllers/posts.controllers.js";

const router = express.Router();

router.get("/", getAllPosts);
router.post("/create", protectRoute, createPost);
router.patch("/:postId/likes", protectRoute, updatePostLikes);

export default router;
