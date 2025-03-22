import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema({
  course_code: { type: String, unique: true },
  course_name: String,
}, { timestamps: true });

export const Course = mongoose.model('Course', CourseSchema);