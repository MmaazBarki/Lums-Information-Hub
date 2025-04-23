import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createPost, getAllPosts } from "../controllers/posts.controllers.js";

const router = express.Router();

router.get("/", getAllPosts);
router.post("/post", protectRoute, createPost);

export default router;
