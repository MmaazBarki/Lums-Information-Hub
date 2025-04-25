import User from "../models/user.models.js";
import Message from "../models/message.models.js";
import cloudinary from "../lib/cloudinary.js"; // Import cloudinary for image upload
import { getReceiverSocketId, io } from "../lib/socket.js";

// This function retrieves all users from the database except the logged-in user, so as the name suggests.
export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        res.status(200).json(filteredUsers);        
    } catch (error) {
        console.error("Error in getUsersForSidebar:", error.message)
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id:userToChatId } = req.params;
        const myId = req.user._id; // Get the logged-in user's ID from the request object
        // Find messages using senderID and receiverID
        const messages = await Message.find({ 
            $or: [ 
                { senderID: myId, receiverID: userToChatId }, 
                { senderID: userToChatId, receiverID: myId } 
            ]
        });
        res.status(200).json(messages);
    } catch (error) {
        console.error("Error in getMessages:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const {id: receiverId} = req.params; // Keep variable name as receiverId for clarity here
        const senderId = req.user._id; // Keep variable name as senderId for clarity here
        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }
        // Use senderID and receiverID when creating the new message
        const newMessage = new Message({ 
            senderID: senderId, 
            receiverID: receiverId, 
            text, 
            image: imageUrl 
        });
        await newMessage.save();
        
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            // Ensure the emitted message also uses senderID and receiverID if needed by frontend immediately
            // The saved newMessage object already has the correct fields from the model
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        res.status(201).json(newMessage); 
    } catch (error) {
        console.error("Error in sendMessage:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};