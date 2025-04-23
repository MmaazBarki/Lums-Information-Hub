import mongoose from "mongoose";
//schema
const user = new mongoose.Schema(
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
        alternate_email: {
            type: String,
            required: false,
        },
        major: {
            type: String,
            required: false,
        },
        highest_education: {
            type: String,
            required: false,
        },
        CV_link: { 
                
            type: String,
            required: false,
        },
        role: {
            type: String,
            enum: ["student", "alumni", "admin"],
            required: true,
        },
        employment_status: {
            type: String,
            enum: ["employed", "unemployed"],
            required: false,
        },
        current_organization: {
            type: String,
            required: false,
        },
        urrent_position: {
            type: String,
            required: false,
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

const User = mongoose.model("User", user);

export default User;
