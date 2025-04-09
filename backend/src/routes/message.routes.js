import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getUsersForSidebar, getMessages, sendMessage } from "../controllers/message.controllers.js";
const router = express.Router();
router.get("/users", protectRoute, getUsersForSidebar); // Remove the 'protectRoute' as we don't have middleware
router.get("/:id", protectRoute, getMessages); // For an id, get all the messages between the logged in user and the user with that id
router.post("/send/:id", protectRoute, sendMessage); // For an id, send a message to the user with that id
export default router;