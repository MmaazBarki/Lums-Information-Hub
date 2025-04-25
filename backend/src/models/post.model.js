import mongoose from "mongoose";

const post = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    description: {
        type: String,
        required: true,
    },
    department: {
        type: String,
    },
    role: {
        type: String,
    },
    category: {
        type: String,
        required: true,
        enum: ['Job Post', 'Internship Post', 'Community Post'],
        default: 'Community Post'
    },
    number_of_likes: {
        type: Number,
        default: 0,
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

}, { timestamps: { createdAt: "created_at", updatedAt: false } });

const Post = mongoose.model("Post", post);
export default Post;