import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { 
    getNotifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead 
} from "../controllers/notification.controllers.js";

const router = express.Router();

router.get("/", protectRoute, getNotifications);

router.patch("/:notificationId/read", protectRoute, markNotificationAsRead);

router.patch("/read-all", protectRoute, markAllNotificationsAsRead);

export default router;