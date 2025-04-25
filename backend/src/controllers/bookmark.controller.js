import User from "../models/user.models.js";
import AcademicResource from "../models/academicResource.model.js";
import mongoose from "mongoose";


export const toggleBookmark = async (req, res) => {
    try {
        const { resourceId } = req.params;
        const userId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(resourceId)) {
            return res.status(400).json({ message: "Invalid resource ID format" });
        }

        const resourceObjectId = new mongoose.Types.ObjectId(resourceId);

        const resourceExists = await AcademicResource.findById(resourceObjectId);
        if (!resourceExists) {
            return res.status(404).json({ message: "Resource not found" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.profile_data) {
            user.profile_data = {};
        }

        if (!user.profile_data.bookmarks) {
            user.profile_data.bookmarks = [];
        }

        const bookmarkExists = user.profile_data.bookmarks.some(
            bookmark => bookmark.toString() === resourceId
        );

        let isBookmarked = false;

        if (bookmarkExists) {

            await User.updateOne(
                { _id: userId },
                { $pull: { "profile_data.bookmarks": resourceObjectId } }
            );
            isBookmarked = false;
        } else {

            await User.updateOne(
                { _id: userId },
                { $push: { "profile_data.bookmarks": resourceObjectId } }
            );
            isBookmarked = true;
        }

        const updatedUser = await User.findById(userId);
        
        return res.status(200).json({
            message: isBookmarked ? "Resource bookmarked successfully" : "Bookmark removed successfully",
            isBookmarked,
            bookmarks: updatedUser.profile_data.bookmarks || []
        });
    } catch (error) {
        console.error("Bookmark Error:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


export const getBookmarkedResources = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.profile_data || !user.profile_data.bookmarks || user.profile_data.bookmarks.length === 0) {
            return res.status(200).json([]);
        }

        const bookmarkedResources = await AcademicResource.find({
            _id: { $in: user.profile_data.bookmarks }
        }).populate("uploader_id", "email role");

        return res.status(200).json(bookmarkedResources);
    } catch (error) {
        console.error("Get Bookmarks Error:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};