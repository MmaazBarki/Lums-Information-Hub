import express from "express";

import { createCourse} from "../controllers/courses.controllers.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create", protectRoute, createCourse);

export default router;
