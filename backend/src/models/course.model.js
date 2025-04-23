import mongoose from "mongoose";

const course = new mongoose.Schema({
    course_code: {
        type: String,
        required: true,
        unique: true,
    },
    course_name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    credits: {
        type: Number,
        required: true,
    }
}, { timestamps: false }); // No need for created_at/updated_at unless for audit trail

const Course = mongoose.model("Course", course);
export default Course;