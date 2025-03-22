import mongoose from 'mongoose';

const ResumeSchema = new mongoose.Schema({
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  resume_link: String,
}, { timestamps: true });

export const Resume = mongoose.model('Resume', ResumeSchema);