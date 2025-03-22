import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema({
  reporter_id: mongoose.Schema.Types.ObjectId,
  content_id: mongoose.Schema.Types.ObjectId,
  content_type: String,
  reason: String,
  status: { type: String, default: 'pending' },
  resolved_by: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
}, { timestamps: true });

export const Report = mongoose.model('Report', ReportSchema);