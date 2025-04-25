import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
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
    number_of_likes: {
        type: Number,
        default: 0,
    },

}, { timestamps: { createdAt: "created_at", updatedAt: false } });

const Post = mongoose.model("Post", postSchema);
export default Post;