import Post from "../models/post.model.js";
import User from "../models/user.models.js";

export const getAllPosts = async (req, res) => {
    try {
        const { department, page = 1, limit = 10 } = req.query; // Get query params

        const query = {};
        if (department && department !== 'All') { // Filter if department is specified and not 'All'
            query.department = department;
        }

        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;

        // Fetch posts with filter and pagination
        const posts = await Post.find(query)
            .sort({ created_at: -1 }) // Sort by newest first
            .skip(skip)
            .limit(limitNum);

        // Get total count for pagination info
        const totalPosts = await Post.countDocuments(query);

        res.status(200).json({
            posts,
            totalPages: Math.ceil(totalPosts / limitNum),
            currentPage: pageNum,
        });
    } catch (error) {
        console.error("Fetch Posts Error:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const createPost = async (req, res) => {
    
    const { description, title } = req.body;
    const creator_id = req.user._id;

    const user = await User.findById(creator_id);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    
    if (!description || !title) {
        return res.status(400).json({ message: "Title and description are required." });
    }

    try {
        const newPost = new Post({
            title,
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
};

export const updatePostLikes = async (req, res) => {
    const { postId } = req.params;
    const { increment } = req.body; // Boolean: true to increment, false to decrement

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        post.number_of_likes += increment ? 1 : -1;
        await post.save();

        res.status(200).json({ post });
    } catch (error) {
        console.error("Update Post Likes Error:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
