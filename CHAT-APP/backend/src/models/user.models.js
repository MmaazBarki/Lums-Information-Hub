import mongoose from "mongoose";
//schema
const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        role: {
            type: String,
            enum: ["student", "alumni", "admin"],
            required: true,
        },
        profile_data: {
            type: mongoose.Schema.Types.Mixed, // JSON object for students/alumni
            default: function () {
                return this.role === "admin" ? undefined : {}; // Only include profile_data for students/alumni
            },
        },
    },
    { timestamps: { createdAt: "created_at", updatedAt: false } }
);

const User = mongoose.model("User", userSchema);

export default User;
