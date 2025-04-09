import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    course_code: {
        type: String,
        required: true,
        unique: true,
    },
    course_name: {
        type: String,
        required: true,
    },
}, { timestamps: false }); // No need for created_at/updated_at unless for audit trail

const Course = mongoose.model("Course", courseSchema);
export default Course;