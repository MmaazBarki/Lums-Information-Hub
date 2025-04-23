import mongoose from "mongoose";

const post = new mongoose.Schema({
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
    report: {
        type: Boolean,
        default: false,
    },
}, { timestamps: { createdAt: "created_at", updatedAt: false } });

const Post = mongoose.model("Post", post);
export default Post;