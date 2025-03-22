import mongoose from 'mongoose';

const JobPostingSchema = new mongoose.Schema({
  poster_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Alumni' },
  company_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  title: String,
  description: String,
  deadline: Date,
}, { timestamps: true });

export const JobPosting = mongoose.model('JobPosting', JobPostingSchema);