import mongoose from 'mongoose';

const UpvoteSchema = new mongoose.Schema({
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  resource_id: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicResource' },
}, { timestamps: true });

export const Upvote = mongoose.model('Upvote', UpvoteSchema);