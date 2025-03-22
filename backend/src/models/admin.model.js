import mongoose from 'mongoose';

const AlumniSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password_hash: String,
  profile_data: mongoose.Schema.Types.Mixed,
}, { timestamps: true });

export const Alumni = mongoose.model('Alumni', AlumniSchema);