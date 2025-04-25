import express from 'express';
import { getAllUsers, deleteUser, deletePost, deleteResource } from '../controllers/admin.controller.js';
import { isAdmin } from '../middleware/admin.middleware.js';

const router = express.Router();

// Route to get all users (admin only)
router.get('/getUsers', isAdmin, getAllUsers);

// Routes for deletion operations
router.delete('/delete/users/:userId', isAdmin, deleteUser);
router.delete('/delete/posts/:postId', isAdmin, deletePost);
router.delete('/delete/resources/:resourceId', isAdmin, deleteResource);

export default router;