import Post from "../models/post.model.js";
import User from "../models/user.models.js";

export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find({});
        res.status(200).json(posts);
    } catch (error) {
        console.error("Fetch Posts Error:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const createPost = async (req, res) => {
    
    const { description } = req.body;
    const creator_id = req.user._id; // Auth middleware adds this

    const user = await User.findById(creator_id);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    
    if (!description) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const newPost = new Post({
            name:user.profile_data.name,
            email:user.email,
            description,
            department: user.profile_data.department,
            role: user.role,
            number_of_likes: 0,
        });

        await newPost.save();
        res.status(201).json({ post: newPost });
    }
    catch (error) {
        console.error("Post Creation Error:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
