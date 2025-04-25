import Notification from "../models/notification.model.js";
import User from "../models/user.models.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id;
        
        const notifications = await Notification.find({ recipient: userId })
            .sort({ createdAt: -1 })
            .populate('sender', 'email profile_data.name profile_data.department')
            .lean();
        
        const unreadCount = await Notification.countDocuments({ 
            recipient: userId,
            isRead: false 
        });
        
        res.status(200).json({ 
            notifications, 
            unreadCount
        });
    } catch (error) {
        console.error("Get Notifications Error:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const markNotificationAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const userId = req.user._id;
        
        const notification = await Notification.findById(notificationId);
        
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }
        
        if (notification.recipient.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Not authorized to access this notification" });
        }
        
        notification.isRead = true;
        await notification.save();
        
        const socketId = getReceiverSocketId(userId.toString());
        if (socketId) {
            io.to(socketId).emit('notificationReadUpdate', notificationId);
        }
        
        res.status(200).json({ message: "Notification marked as read", notification });
    } catch (error) {
        console.error("Mark Notification As Read Error:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const markAllNotificationsAsRead = async (req, res) => {
    try {
        const userId = req.user._id;
        
        await Notification.updateMany(
            { recipient: userId, isRead: false },
            { isRead: true }
        );
        
        const socketId = getReceiverSocketId(userId.toString());
        if (socketId) {
            io.to(socketId).emit('allNotificationsReadUpdate');
        }
        
        res.status(200).json({ message: "All notifications marked as read" });
    } catch (error) {
        console.error("Mark All Notifications As Read Error:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const createPostNotification = async (post, senderId) => {
    try {
        const department = post.department;
        
        const usersToNotify = await User.find({
            'profile_data.department': department,
            _id: { $ne: senderId }
        });
        
        const notificationPromises = usersToNotify.map(user => {
            const newNotification = new Notification({
                recipient: user._id,
                sender: senderId,
                type: 'post',
                content: `New post in ${department}: ${post.title}`,
                referenceId: post._id,
                onModel: 'Post'
            });
            
            const socketId = getReceiverSocketId(user._id.toString());
            if (socketId) {
                io.to(socketId).emit('newNotification', {
                    ...newNotification.toObject(),
                    sender: { _id: senderId }
                });
            }
            
            return newNotification.save();
        });
        
        await Promise.all(notificationPromises);
    } catch (error) {
        console.error("Create Post Notification Error:", error);
    }
};

export const createMessageNotification = async (message, senderName) => {
    try {
        const newNotification = new Notification({
            recipient: message.receiverID,
            sender: message.senderID,
            type: 'message',
            content: `New message from ${senderName}`,
            referenceId: message._id,
            onModel: 'Message'
        });
        
        await newNotification.save();
        
        const socketId = getReceiverSocketId(message.receiverID.toString());
        if (socketId) {
            io.to(socketId).emit('newNotification', {
                ...newNotification.toObject(),
                sender: { _id: message.senderID }
            });
        }
        
        return newNotification;
    } catch (error) {
        console.error("Create Message Notification Error:", error);
        return null;
    }
};