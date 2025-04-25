import User from "../models/user.models.js";
import cloudinary from "../lib/cloudinary.js";

// Upload or update profile picture
export const uploadProfilePicture = async (req, res) => {
    try {
        const { userId } = req.params;
        const { image } = req.body;

        if (!image) {
            return res.status(400).json({ message: "Image data is required" });
        }

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // If user already has a profile picture, delete it from Cloudinary
        if (user.profile_data?.profilePicture?.publicId) {
            await cloudinary.uploader.destroy(user.profile_data.profilePicture.publicId);
        }

        // Upload new image to Cloudinary
        const result = await cloudinary.uploader.upload(image, {
            folder: "profile-pictures",
            transformation: [
                { width: 500, height: 500, crop: "fill" },
                { quality: "auto" }
            ]
        });

        // Update user's profile data
        if (!user.profile_data) {
            user.profile_data = {};
        }

        user.profile_data.profilePicture = {
            url: result.secure_url,
            publicId: result.public_id
        };

        await user.save();

        return res.status(200).json({
            message: "Profile picture updated successfully",
            profilePicture: user.profile_data.profilePicture
        });
    } catch (error) {
        console.error("Error uploading profile picture:", error);
        return res.status(500).json({ message: "Failed to upload profile picture" });
    }
};

// Remove profile picture
export const removeProfilePicture = async (req, res) => {
    try {
        const { userId } = req.params;

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // If user has a profile picture, delete it from Cloudinary
        if (user.profile_data?.profilePicture?.publicId) {
            await cloudinary.uploader.destroy(user.profile_data.profilePicture.publicId);
        }

        // Update user's profile data
        if (user.profile_data) {
            user.profile_data.profilePicture = {
                url: "",
                publicId: ""
            };
        }

        await user.save();

        return res.status(200).json({
            message: "Profile picture removed successfully"
        });
    } catch (error) {
        console.error("Error removing profile picture:", error);
        return res.status(500).json({ message: "Failed to remove profile picture" });
    }
};

// Get user profile picture
export const getProfilePicture = async (req, res) => {
    try {
        const { userId } = req.params;

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Return the profile picture URL
        return res.status(200).json({
            profilePicture: user.profile_data?.profilePicture || { url: "", publicId: "" }
        });
    } catch (error) {
        console.error("Error getting profile picture:", error);
        return res.status(500).json({ message: "Failed to get profile picture" });
    }
};