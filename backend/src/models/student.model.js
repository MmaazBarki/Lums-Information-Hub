import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    password_hash: String,
    profile_data: mongoose.Schema.Types.Mixed,
}, { timestamps: true });

export const Student = mongoose.model('Student', StudentSchema);