import mongoose from "mongoose";

const profileDataSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false
    },
    bio: {
        type: String,
        required: false
    },
    interests: {
        type: [String],
        required: false
    },
    profilePicture: {
        url: {
            type: String,
            default: ""
        },
        publicId: {
            type: String,
            default: ""
        }
    },
    bookmarks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AcademicResource'
    }],
    
}, { _id: false, strict: false });

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
        verified: {
            type: Boolean,
            default: false,
            required: true,
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
            type: profileDataSchema,
            default: function () {
                return this.role === "admin" ? undefined : {};
            },
        },
    },
    { timestamps: { createdAt: "created_at", updatedAt: false } }
);

const User = mongoose.model("User", user);

export default User;
