import mongoose from "mongoose";

const academicResourceSchema = new mongoose.Schema({
    uploader_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Will be either student or alumni
        required: true,
    },
    uploader_name: {
        type: String,
        required: true,
    },
    course_code: {
        type: String,
        required: true,
        ref: "Course", // Reference by course_code, not ObjectId
    },
    topic: {
        type: String,
        required: true,
    },
    file_url: {
        type: String,
        required: true,
    },
    file_type: {
        type: String,
        required: true,
        default: "pdf"
    },
    file_size: {
        type: Number,
        required: true,
    },
    downloads: {
        type: Number,
        default: 0,
    },
    description: {
        type: String,
        required: true,
    },
    uploaded_at: {
        type: Date,
        default: Date.now,
    },
});

const AcademicResource = mongoose.model("AcademicResource", academicResourceSchema);
export default AcademicResource;
