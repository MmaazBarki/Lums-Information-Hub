import Post from "../models/post.model.js";

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

    const creator_name = req.user.profile_data.name || "mock_name"; // Mock name for now, replace with actual data from user profile
    
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
