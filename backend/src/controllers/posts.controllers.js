import Post from "../models/post.model.js";
import User from "../models/user.models.js";

export const getAllPosts = async (req, res) => {
    try {
        const { department, page = 1, limit = 10 } = req.query; // Get query params
        const userId = req.user?._id; // Get current user ID if available

        const query = {};
        if (department && department !== 'All') { // Filter if department is specified and not 'All'
            query.department = department;
        }

        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;

        // Fetch posts using .lean() for plain JS objects
        const posts = await Post.find(query)
            .sort({ created_at: -1 }) // Sort by newest first
            .skip(skip)
            .limit(limitNum)
            .lean(); // Use lean() for better performance and easier modification

        // Add isLikedByCurrentUser field
        const postsWithLikeStatus = posts.map(post => ({
            ...post,
            // Check if the current user's ID is in the likes array
            isLikedByCurrentUser: userId ? post.likes.some(likeId => likeId.equals(userId)) : false
        }));

        // Get total count for pagination info
        const totalPosts = await Post.countDocuments(query);

        res.status(200).json({
            posts: postsWithLikeStatus, // Send modified posts
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
    const { increment } = req.body; // Boolean: true to like, false to unlike
    const userId = req.user._id; // Get user ID from authenticated user

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const userIndex = post.likes.indexOf(userId);

        if (increment && userIndex === -1) { // User wants to like and hasn't liked yet
            post.likes.push(userId);
            post.number_of_likes += 1;
        } else if (!increment && userIndex !== -1) { // User wants to unlike and has liked before
            post.likes.splice(userIndex, 1);
            post.number_of_likes -= 1;
        } else {
            // If increment is true but user already liked, or increment is false but user hasn't liked,
            // do nothing, or return a specific message if needed.
            // For now, just return the current post state.
            return res.status(200).json({ post });
        }

        await post.save();

        res.status(200).json({ post });
    } catch (error) {
        console.error("Update Post Likes Error:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
