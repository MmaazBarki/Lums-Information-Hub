import mongoose from 'mongoose';

const AcademicResourceSchema = new mongoose.Schema({
  uploader_id: mongoose.Schema.Types.ObjectId,
  course_code: { type: String, ref: 'Course' },
  topic: String,
  file_url: String,
}, { timestamps: true });

export const AcademicResource = mongoose.model('AcademicResource', AcademicResourceSchema);